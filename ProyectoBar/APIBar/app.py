from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel, Field
from typing import List, Optional, Union
import uvicorn


app=FastAPI()

# Conexión a MongoDB
client = MongoClient("mongodb+srv://javihp03:D8wjHJ0JpAG6be6O@cluster0.ycxgksh.mongodb.net/?retryWrites=true&w=majority",tlsAllowInvalidCertificates=True)
db = client["BarManagement"]
# Guardo en una variable cada una de las colecciones
collection_espacios = db['Espacios']
collection_Menu=db['Menu']
collection_Reservas=db['Reservas']
collection_Pedidos=db['Pedidos']


# Modelo Pydantic para validar datos
class Telefono(BaseModel):
    numero: int = Field(..., alias="numeroInt")

class Reserva(BaseModel):
    id: str
    idsEspacios: List[str]
    telefono: Telefono

class Sitio(BaseModel):
    id: str
    disponibilidad: bool

class Espacio(BaseModel):
    id: str
    tipo: str
    capacidad: Optional[int] = None
    disponibilidad: Optional[bool] = None
    sitios: Optional[List[Sitio]] = None

    
class Item(BaseModel):
    id: str
    nombre: str
    tipo: str
    precio: float
    stock: Optional[int] = None
    imagen:Optional[str]=None

class ItemMenu(BaseModel):
    idItem: str
    cantidad: int = Field(..., alias="cantidad")
    
class Pedido(BaseModel):
    id: str
    idEspacios: List[str]
    telefono:int
    items: List[ItemMenu]
    estado: str
    estadoPago: str

class Plato(BaseModel):
    id: str
    nombre: str
    tipo: str
    precio: float
    stock: Optional[int] = None
# Nuevo modelo Pydantic para actualizar el stock
class StockUpdate(BaseModel):
    idItem: str
    cantidad: int


class Menu(BaseModel):
    id: str
    nombre: str
    tipo: str
    precio: int
    platos: Optional[List[str]] = None
    
# Modelo Pydantic extendido para los Menús que incluyen los platos
class Menu(Item):
    platos: List[Item] = []


@app.get("/")
async def read_root():
    return {"Funciona": "Yes"}


# Comprueba si el numero de telefono tiene una reserva vinculada
@app.get("/reservas/telefono/{telefono_numero}")
async def read_reserva_por_telefono(telefono_numero: int):
    reserva = collection_Reservas.find_one({"telefono": telefono_numero})
    print(reserva['telefono'])
    if reserva['telefono'] == telefono_numero:
        reserva['_id'] = str(reserva['_id'])  # Convertir ObjectId a string
        return {"existe": True, "reserva": reserva}
    else:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")


@app.get("/menu/", response_model=List[Union[Item, Menu]])
async def leer_menu_completo():
    menu_completo = []
    items_menu = list(collection_Menu.find({}))

    for item in items_menu:
        item_data = dict(item)  # Convertir el documento de MongoDB a un diccionario
        if item_data['tipo'] == 'Menú':
            platos_menu = []
            for plato_id in item_data['platos']:
                plato = collection_Menu.find_one({'id': plato_id})
                if plato:
                    # Asegúrate de limpiar '_id' y otros campos no deseados de `plato` si es necesario
                    platos_menu.append(Item(**plato))
            item_data.pop('platos', None)  # Eliminar la clave 'platos' si existe en item_data
            menu_completo.append(Menu(**item_data, platos=platos_menu))
        else:
            # Asegúrate de limpiar '_id' y otros campos no deseados de `item_data` si es necesario
            menu_completo.append(Item(**item_data))

    return menu_completo


# Crea un pedido al pedir
@app.post("/pedidos/", response_model=Pedido)
async def crear_pedido(pedido: Pedido):
    print("Hola")
    pedido_dict = pedido.model_dump(by_alias=True)# Convertir el modelo Pydantic a un diccionario para MongoDB
    print(f"Pedido {pedido_dict}")
    resultado = collection_Pedidos.insert_one(pedido_dict)
    pedido_creado = collection_Pedidos.find_one({"_id": resultado.inserted_id})
    return pedido_creado

# Actualizar el stock cada vez que se realiza un pedido
@app.patch("/update-stock/", response_model=List[Item])
async def update_stock(updates: List[StockUpdate]):
    updated_items = []
    for update in updates:
        # Buscar el ítem en la base de datos por idItem
        item = collection_Menu.find_one({'id': update.idItem})
        if not item:
            raise HTTPException(status_code=404, detail=f"Item with id {update.idItem} not found")
        if item['stock'] < update.cantidad:
            raise HTTPException(status_code=400, detail=f"Not enough stock for item {update.idItem}")

        # Actualizar el stock del ítem
        new_stock = item['stock'] - update.cantidad
        collection_Menu.update_one({'id': update.idItem}, {'$set': {'stock': new_stock}})
        
        # Agregar el ítem actualizado a la lista de respuesta
        item['stock'] = new_stock
        updated_items.append(Item(**item))

    return updated_items



@app.get("/pedidos/telefono/{telefono}", response_model=List[Pedido])
async def obtener_pedidos_por_telefono(telefono: int):
    pedidos = collection_Pedidos.find({"telefono": telefono})
    return list(pedidos)

# Elimina un pedido por id de pedido
@app.delete("/pedidos/{pedido_id}", response_model=dict)
async def eliminar_pedido(pedido_id: str):
    # Buscar el pedido por ID
    resultado_busqueda = collection_Pedidos.find_one({"id": pedido_id})

    if resultado_busqueda is None:
        # Si no se encuentra el pedido, devuelve un error 404
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    # Eliminar el pedido encontrado
    collection_Pedidos.delete_one({"id": pedido_id})

    # Devolver una confirmación de que el pedido fue eliminado
    return {"mensaje": f"Pedido con ID {pedido_id} eliminado correctamente"}



# Al pagar se elimina la reserva que contenga el numero de telefono del usuario
@app.delete("/reservas/eliminar/{telefono_numero}")
async def eliminar_reservas_por_telefono(telefono_numero: int):
    # Buscar y eliminar todas las reservas con el número de teléfono dado
    resultado = collection_Reservas.delete_many({"telefono": telefono_numero})

    if resultado.deleted_count == 0:
        # Si no se encontraron reservas para eliminar, devuelve un error
        raise HTTPException(status_code=404, detail="No se encontraron reservas con ese número de teléfono")
    
    return {"mensaje": f"Se eliminaron {resultado.deleted_count} reservas asociadas al teléfono {telefono_numero}"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)