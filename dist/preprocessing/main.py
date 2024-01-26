import tensorflow as tf
import tensorflow_hub as hub
import csv
import nltk
from nltk.tokenize import sent_tokenize
from sklearn.manifold import TSNE
import numpy
import json



sentance_embeddings = {}
# Load the Universal Sentence Encoder module
use_module_url = "https://tfhub.dev/google/universal-sentence-encoder/4"
embed = hub.load(use_module_url)

#download nltk punkt
nltk.download('punkt')

#break text into sentances
def process_txt_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
        sentences = sent_tokenize(content)
    return sentences

def make_json(csvFilePath, jsonFilePath):
     
    # create a dictionary
    data = {}
     
    # Open a csv reader called DictReader
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)
         
        # Convert each row into a dictionary 
        # and add it to data
        for rows in csvReader:
             
            # Assuming a column named 'No' to
            # be the primary key
            key = rows['#']
            data[key] = rows
 
    # Open a json writer, and use the json.dumps() 
    # function to dump data
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))

#move through a directory
sentences = process_txt_file('theGreatGatsby.txt')
embeddings = embed(sentences)
X = embeddings.numpy()
X_embedded = TSNE(n_components=3).fit_transform(X) #reduce dimensions with TSNE
with open("output.csv", 'w', newline='', encoding='utf-8') as csv_file: #open/make csv file
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow(['#','Sentance', 'Embedding'])
    for i in range(len(X_embedded)):
        csv_writer.writerow([i, sentences[i].replace("\n", ""), X_embedded[i]])
 
# Decide the two file paths according to your 
# computer system
csvFilePath = r'output.csv'
jsonFilePath = r'output.json'
 
# Call the make_json function
make_json(csvFilePath, jsonFilePath)