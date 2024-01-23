package com.example.videojuegos;


import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class VideojuegoAdapter extends RecyclerView.Adapter<VideojuegoAdapter.VideojuegoViewHolder> {

    private Context context;
    private ArrayList<Videojuego> videojuegos;
    private OnItemClickListener listener;

    public VideojuegoAdapter(Context context, ArrayList<Videojuego> videojuegos, OnItemClickListener listener) {
        this.context = context;
        this.videojuegos = videojuegos;
        this.listener = listener;
    }

    @NonNull
    @Override
    public VideojuegoViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.mis_juegos, parent, false);
        return new VideojuegoViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull VideojuegoViewHolder holder, int position) {
        Videojuego videojuego = videojuegos.get(position);
        holder.bind(videojuego, listener);
    }

    @Override
    public int getItemCount() {
        return videojuegos.size();
    }

    public static class VideojuegoViewHolder extends RecyclerView.ViewHolder {

        TextView titleTextView, developerTextView, launchTextView;

        public VideojuegoViewHolder(@NonNull View itemView) {
            super(itemView);
            titleTextView = itemView.findViewById(R.id.game_title_txt);
            developerTextView = itemView.findViewById(R.id.game_developer_txt);
            launchTextView = itemView.findViewById(R.id.game_launch_txt);
        }

        public void bind(Videojuego videojuego, OnItemClickListener listener) {
            titleTextView.setText(videojuego.getTitulo());
            developerTextView.setText(videojuego.getDesarrollador());
            launchTextView.setText(videojuego.getLanzamiento());
            itemView.setOnClickListener(view -> listener.onItemClick(getAdapterPosition()));
        }
    }

    public interface OnItemClickListener {
        void onItemClick(int position);
    }
}

