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

class ItemMenu(BaseModel):
    idItem: str
    cantidad: int = Field(..., alias="numeroInt")
    
class Item(BaseModel):
    id: str
    nombre: str
    tipo: str
    precio: float
    stock: Optional[int] = None
    imagen:Optional[str]=None

class Pedido(BaseModel):
    id: str
    idEspacio: str
    items: List[ItemMenu]
    estado: str
    estadoPago: str

class Plato(BaseModel):
    id: str
    nombre: str
    tipo: str
    precio: float
    stock: Optional[int] = None

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


# Crea un pedido al pagar
@app.post("/pedidos/", response_model=Pedido)
async def crear_pedido(pedido: Pedido):
    pedido_dict = pedido.dict(by_alias=True)  # Convertir el modelo Pydantic a un diccionario para MongoDB
    resultado = collection_Pedidos.insert_one(pedido_dict)
    pedido_creado = collection_Pedidos.find_one({"_id": resultado.inserted_id})
    return pedido_creado

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)