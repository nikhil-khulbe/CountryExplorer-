import {View, Text, Image, StyleSheet, Linking, Pressable} from 'react-native';
import React, {useRef, useState} from 'react';
import LottieView from 'lottie-react-native';

const Detail = ({route}) => {
  let {country} = route.params;
  let bookmarkRef = useRef(null);
  let [bookmark, setBookMark] = useState(false);

  console.log(country);
  function handleAni() {
    if (bookmark) {
      bookmarkRef?.current?.reset();
    } else {
      bookmarkRef?.current?.play();
    }
    setBookMark(!bookmark);
  }
  return (
    <View style={styles.detailCtn}>
      <Pressable onPress={() => handleAni()}>
        <LottieView
          source={require('../../assets/bookMark3.json')}
          loop={false}
          style={styles.bookmarkAni}
          ref={bookmarkRef}
        />
      </Pressable>
      <Image source={{uri: country.flags.png}} style={styles.imgCtn} />
      <Text style={styles.textSize}>
        Official Name: {country.name?.official}
      </Text>
      <Text style={styles.textSize}>Capital: {country?.capital?.[0]}</Text>
      <Text style={styles.textSize}>Region: {country?.region}</Text>
      <Text style={styles.textSize}>Subregion: {country?.subregion}</Text>
      <Text style={styles.textSize}>
        Population: {country?.population.toLocaleString()}
      </Text>
      <View style={styles.langCtn}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Languages</Text>
        {Object.values(country?.languages).map((el, i) => (
          <Text style={{fontSize: 15}}>
            {i + 1}: {el}
          </Text>
        ))}
      </View>
      <Text style={styles.textSize}>
        {Object.values(country?.currencies)?.[0].name}
      </Text>
      <Pressable
        onPress={() => Linking.openURL(country.maps?.googleMaps)}
        style={({pressed}) => [
          {opacity: pressed ? 0.5 : 1, color: pressed ? 'black' : 'blue'},
        ]}>
        <Text style={styles.linkCtn}>Google Map</Text>
      </Pressable>
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  imgCtn: {
    height: 200,
    width: 300,
    borderRadius: 15,
  },
  detailCtn: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(181,17,14,0.2)',
  },
  linkCtn: {
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(24, 20, 236, 0.2)',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'blue',
  },
  textSize: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  langCtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkAni: {
    height: 100,
    width: 100,
  },
});
