import React, {useEffect, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import newsAPI from './services/newsAPI';
import {Image, Modal, TouchableHighlight, ScrollView} from 'react-native';


export default function App() {
  const [news, setNews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [findNews, setFindNews] = useState({});
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const getNews = async () => {
      const {articles, totalResults} = await newsAPI.getNews("covid", pageSize, currentPage);
      setNews(articles)
      setTotalResults(totalResults)
    };
    getNews();
  }, [currentPage]);

  let pagesCount = Math.ceil(totalResults / pageSize);
  let pages = [];
  for (let i = 1; i <= (pagesCount > 10 ? 10 : pagesCount); i++) {
    pages.push(i);
  }

  return (
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>COVID NEWS : {totalResults}</Text>
        </View>

        <ScrollView>
          {news.map((article) => {
            return (
                <View style={styles.newsBlock}>
                  <TouchableHighlight
                      activeOpacity="1"
                      underlayColor="#00B945"
                      onPress={() => {
                        setModalVisible(true);
                        setFindNews(article);
                      }}
                  >
                    <View>
                      <Image
                          source={{
                            uri: article.urlToImage,
                          }}
                          style={{width: '100%', height: '80%'}}
                      />

                      <View style={styles.textBlock}>
                        <Text style={styles.newsText}>{article.title}</Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                </View>
            );
          })}
        </ScrollView>

        <View style={styles.pagesList}>
          {pages.map((page) => {
            return (
                <TouchableHighlight
                    underlayColor='none'
                    onPress={() => {
                      setCurrentPage(page);
                    }}>
                  <Text style={currentPage === page ? styles.selectPage : styles.page}>{page}</Text>
                </TouchableHighlight>
            )
          })}
        </View>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
        >
          <View style={styles.modal}>
            <ScrollView>
              <Image
                  source={{
                    uri: findNews.urlToImage ? findNews.urlToImage : 'https://reactnative.dev/docs/assets/p_cat2.png'
                  }}
                  style={{width: '100%', height: '100%'}}
              />

              <Text></Text>

              <Text style={styles.newsContent}>{findNews.description}</Text>

              <Text></Text>

              <Text style={styles.newsAuthor}>{!findNews.author ? "Anonim" : findNews.author}</Text>

              <TouchableHighlight
                  style={styles.openButton}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                <Text>Close</Text>
              </TouchableHighlight>
            </ScrollView>
          </View>
        </Modal>

        <StatusBar style="auto"/>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,

    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#fff'
  },

  title: {
    fontSize: 20
  },

  newsBlock: {
    marginBottom: 10,

    height: 275,
    width: 375,

    backgroundColor: '#63DC90',
  },

  textBlock: {
    width: "100%"
  },

  newsText: {
    fontSize: 15
  },

  modal: {
    marginTop: 50,

    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    width: "100%",

    backgroundColor: '#fff',
  },

  openButton: {
    padding: 10,
    marginTop: 50,

    backgroundColor: '#63DC90',
    borderRadius: 20,

    elevation: 2,
  },

  newsContent: {
    fontSize: 20,
  },

  newsPublishedAt: {
    fontSize: 25,
    color: '#63DC90',
  },

  newsAuthor: {
    fontSize: 25,
    color: '#00782D',
  },

  pagesList: {
    marginBottom: 100,

    display: 'flex',
    flexDirection: 'row',
  },

  page: {
    paddingLeft: 20
  },

  selectPage: {
    paddingLeft: 20,

    fontSize: 20,
    color: '#00782D'
  }
});
