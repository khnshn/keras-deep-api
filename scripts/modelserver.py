import socket
import sys
from keras.applications import ResNet50
from keras.preprocessing.image import img_to_array
from keras.applications import imagenet_utils
from PIL import Image
import numpy as np
import io
import json

# model preparation
model = None


def load_model():
    global model
    model = ResNet50(weights='imagenet')


def prepare_image(image, target):
    if image.mode != 'RGB':
        image = image.convert('RGB')
    image = image.resize(target)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    image = imagenet_utils.preprocess_input(image)
    return image


def predict(filename):
    data = {'success': False}
    #image = open('../uploads/'+filename, 'rb')
    image = Image.open('../uploads/'+filename)
    image = prepare_image(image, target=(224, 224))
    preds = model.predict(image)
    results = imagenet_utils.decode_predictions(preds)
    data['predictions'] = []
    for (imagenetID, label, prob) in results[0]:
        r = {'label': label, 'probability': float(prob)}
        data['predictions'].append(r)
    data['success'] = True
    return data


load_model()

# server preparation
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_address = ('localhost', 10000)
print('starting at %s on port %d...' % server_address)
sock.bind(server_address)
sock.listen(1)

while True:
    print('waiting for connection...')
    connection, client_address = sock.accept()
    try:
        print('connection from', client_address)
        while True:
            filename = connection.recv(128).decode()
            if len(filename) == 0:
                break
            print('received %s' % filename)
            data = predict(filename)
            if data:
                print('sending data back to client')
                connection.sendall(json.dumps(data).encode())
            else:
                print('no more data from', client_address)
                break
    finally:
        connection.close()
        print('connection closed')
