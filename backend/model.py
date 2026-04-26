import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle

class ChannelRecommender:
    def __init__(self):
        self.df = None
        self.similarity = None

    def load_data(self, path):
        self.df = pd.read_csv(path)
        self.df = self.df[['channel_name', 'content']]
        self.df.dropna(inplace=True)
        self.df.drop_duplicates(subset='channel_name', inplace=True)
        self.df.reset_index(drop=True, inplace=True)

    def build_model(self):
        tfidf = TfidfVectorizer(stop_words='english', max_features=5000)
        matrix = tfidf.fit_transform(self.df['content'])
        self.similarity = cosine_similarity(matrix)

    def recommend(self, channel_name, top_n=5):
        matches = self.df[self.df['channel_name'].str.contains(channel_name, case=False)]

        if matches.empty:
            return ["Channel not found"]

        idx = matches.index[0]
        scores = list(enumerate(self.similarity[idx]))
        scores = sorted(scores, key=lambda x: x[1], reverse=True)

        return [self.df.iloc[i[0]]['channel_name'] for i in scores[1:top_n+1]]

    def save_model(self):
        pickle.dump(self.df, open("data.pkl", "wb"))
        pickle.dump(self.similarity, open("similarity.pkl", "wb"))

    def load_model(self):
        self.df = pickle.load(open("data.pkl", "rb"))
        self.similarity = pickle.load(open("similarity.pkl", "rb"))