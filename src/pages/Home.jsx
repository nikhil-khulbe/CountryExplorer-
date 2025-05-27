import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Touchable,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import LottieView from 'lottie-react-native';
const Home = ({navigation}) => {
  let [displayCountry, setDisplayCountry] = useState([]);
  let [originalList, setOriginalList] = useState([]);
  let [regionList, setRegionList] = useState([]);
  let [sortOption, setSortOption] = useState(null);
  let [selectedRegion, setSelectedRegion] = useState(null);
  let [isLoading, setIsLoading] = useState(true);
  let [isLoadingMore, setIsLoadingMore] = useState(false);
  let [modalVisible, setModalVisible] = useState(false);
  let [page, setPage] = useState(1);

  const timerRef = useRef(null);
  useEffect(() => {
    const fetchingData = async () => {
      try {
        setIsLoading(true);
        let response = await axios.get('https://restcountries.com/v3.1/all');
        let data = response.data;
        let initialData = data.slice(0, 10);
        setDisplayCountry(initialData);
        setOriginalList(data);

        setRegionList([...new Set(originalList.map(el => el.region))]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchingData();
  }, []);
  // console.log(displayCountry[0].capital[0]);
  const renderItem = ({item}) => (
    <Pressable
      key={item.name.commom}
      onPress={() => navigation.navigate('Detail', {country: item})}
      style={({pressed}) => [
        {
          backgroundColor: pressed ? 'rgba(244, 104, 17, 1)' : 'white',
        },
      ]}>
      <View style={styles.countryCtn}>
        <View>
          <Image source={{uri: item.flags.png}} style={styles.imgCtn} />
        </View>
        <View style={styles.textCtn}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.nameCtn}>
            Name: {item.name.common}
          </Text>
          <Text>Region: {item.region}</Text>
          <Text>Capital: {item.capital?.[0]}</Text>
          <Text>Population: {item.population}</Text>
        </View>
      </View>
    </Pressable>
  );

  function handleSearch(txt) {
    // console.log(txt);
    let seracedArr = originalList.filter(el =>
      el.name.common.toLowerCase().includes(txt.toLowerCase()),
    );
    // console.log(seracedArr);
    if (seracedArr.length > 0) {
      setDisplayCountry(seracedArr);
    } else {
      setDisplayCountry(originalList);
    }
  }

  function debounce(txt) {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleSearch(txt);
    }, 500);
  }

  useEffect(() => {
    setIsLoading(true);
    if (sortOption) {
      const sortCountaries = [...originalList].sort((a, b) => {
        if (sortOption == 'name') {
          return a.name.common.localeCompare(b.name.common);
        } else if (sortOption == 'population') {
          return a.population - b.population;
        }
        return 0;
      });
      setDisplayCountry(sortCountaries.slice(0, 10));
      setPage(1);
      setIsLoading(false);
    }
  }, [sortOption]);

  if (isLoading) {
    return (
      <LottieView
        source={require('../../assets/loading.json')}
        style={styles.LoadingAni}
        loop={true}
        autoPlay={true}
      />
    );
  }

  const regionFun = ({item}) => (
    <Pressable
      key={item}
      style={({pressed}) => [styles.selectBtnCtn, {opacity: pressed ? 0.5 : 1}]}
      onPress={() => {
        let filteredDataRegion = originalList.filter(el => el.region == item);
        setSelectedRegion(item);
        setModalVisible(false);
        setDisplayCountry(filteredDataRegion.slice(0, 10));
        setPage(1);
      }}>
      <Text>{item}</Text>
    </Pressable>
  );

  const loadMoreData = () => {
    setIsLoadingMore(true);
    try {
      let nextPage = page + 1;
      let startIndex = nextPage * 10;
      let endIndex = startIndex + 10;
      let newData = originalList.slice(startIndex, endIndex);
      setDisplayCountry(prev => [...prev, ...newData]);
      setPage(nextPage);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const renderFooter = () => {
    if (setIsLoadingMore) {
      return (
        <View style={{paddingVertical: 20}}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      );
    }
  };

  return (
    <View style={styles.mainCtn}>
      <TextInput
        placeholder="Search Country Name"
        style={styles.searchInput}
        onChangeText={text => debounce(text)}
      />
      <View style={styles.sortCtn}>
        <Pressable
          onPress={() => setSortOption('name')}
          style={({pressed}) => [styles.sortBtn, {opacity: pressed ? 0.5 : 1}]}>
          <Text>Sort By Name(A-Z)</Text>
        </Pressable>
        <Pressable
          onPress={() => setSortOption('population')}
          style={({pressed}) => [styles.sortBtn, {opacity: pressed ? 0.5 : 1}]}>
          <Text>Sort By Population(Low-High)</Text>
        </Pressable>
      </View>
      <View>
        <Pressable
          style={({pressed}) => [
            styles.selectBtn,
            {opacity: pressed ? 0.5 : 1},
          ]}
          onPress={() => setModalVisible(true)}>
          <Text>{selectedRegion || 'Select Region'}</Text>
        </Pressable>
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalCtn}>
            <View style={styles.modalContent}>
              <FlatList
                data={regionList}
                keyExtractor={item => item}
                renderItem={regionFun}
              />
            </View>
          </View>
        </Modal>
      </View>
      <FlatList
        data={displayCountry}
        keyExtractor={item => item.cca2}
        initialNumToRender={10}
        renderItem={renderItem}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  countryCtn: {
    backgroundColor: 'rgba(244,104,17,0.2)',
    marginHorizontal: 20,
    marginVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    overflow: 'hidden',
    gap: 10,
  },
  mainCtn: {},
  imgCtn: {
    height: 100,
    width: 100,
    borderRadius: 10,
  },
  textCtn: {
    flex: 1,
    flexShrink: 1,
  },
  nameCtn: {},
  searchInput: {
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  sortCtn: {},
  sortBtn: {
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(46,119,47,0.2)',
  },
  selectBtn: {
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    // width: '50%',
    backgroundColor: 'rgba(74,62,153,0.2)',
    display: 'flex',

    alignItems: 'center',
  },
  selectBtnCtn: {
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    // width: '50%',
    backgroundColor: 'rgba(74,62,153,0.2)',
    display: 'flex',

    alignItems: 'center',
  },
  modalCtn: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  modalContent: {
    backgroundColor: 'rgb(249,176,169)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%',
    width: '50%',
    borderRadius: 15,
    paddingTop: 30,
  },
  LoadingAni: {
    height: 200,
    width: 200,
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '25%',
  },
});
