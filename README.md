# audio-streaming
Audio streaming project

## How to use?


### Arduino

Cuando nos llegan señales guardamos en un JSON la hora a la que nos llegó y el nombre del audio que tengamos que reproducir

```bash
python arduino_register.py
```

### Backend

Es una API que cuando se la consulta te dice que audio y en que segundo hay que reproducir, esto se calcula a partir de leer la data del JSON que genero `arduino_register.py`

Se ejecuta asi

```bash
python backend.py
```

Luego se consulta, por ejemplo por el proyector 1, accediendo a http://localhost:5050/1

### Frontend

El sitio web seria un sitio hecho en javascript + html que tendria 3 botones simplemente. Uno por cada proyector, si apretás un proyector se marca como que se te va a reproducir el audio de ese proyector. Si hay algun proyector seleccionado el sitio cada 5 segundos le pega a la API para ver si tiene que cambiar de track o si esta atrasado con el timing

Me parece que la posta seria usar la web audio api, puede servir inspirarse en [esto](https://github.com/mathigatti/gestures2anything/blob/main/index.html).