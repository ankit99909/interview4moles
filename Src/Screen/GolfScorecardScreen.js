import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Animated, Dimensions } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CircleWithArrows from '../Componets/CircleWithArrows';

const { width, height } = Dimensions.get('window');

const holesData = Array.from({ length: 18 }, (_, i) => {
  const holeNumber = i + 1;
  const dataIndex = holeNumber <= 9 ? i : i + 1;
  return {
    hole: holeNumber,
    yards: 200 + (i * 10), // Adjust this for real yard data
    par: 3 + (i % 5), // Adjust this for real par data
    index: 12 - (i % 12), // Adjust this for real index data
  };
});

const GolfScorecardScreen = ({ navigation }) => {
  const [scores, setScores] = useState({});
  const [putts, setPutts] = useState({});
  const [currentHoleIndex, setCurrentHoleIndex] = useState(0);
  const [hide, setHide] = useState(true);


  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('@scores', JSON.stringify(scores));
        await AsyncStorage.setItem('@putts', JSON.stringify(putts));

        // Simulate server sync
        const { isConnected } = await NetInfo.fetch();
        if (isConnected) {
          console.log('Simulating server sync...');
          // Add actual API call here
        }
      } catch (e) {
        console.error('Failed to save data', e);
      }
    };
    saveData();
  }, [scores, putts]);

  const handleScoreChange = (hole, delta) => {
    const newValue = (scores[hole] || holesData[hole - 1].par) + delta;
    setScores(prev => ({ ...prev, [hole]: Math.max(0, newValue) }));
  };

  const handlePuttsChange = (hole, delta) => {
    const newValue = (putts[hole] || 0) + delta;
    setPutts(prev => ({ ...prev, [hole]: Math.max(0, newValue) }));
  };

  const nextHole = () => {
    if (currentHoleIndex < holesData.length - 1) {
      setCurrentHoleIndex(currentHoleIndex + 1);
    }
  };

  const prevHole = () => {
    if (currentHoleIndex > 0) {
      setCurrentHoleIndex(currentHoleIndex - 1);
    }
  };

  const { hole, yards, par, index } = holesData[currentHoleIndex];
  const currentScore = scores[hole] || par;
  const currentPutts = putts[hole] || 0;

  const scaleAnim = new Animated.Value(1);
  const [highlighted, setHighlighted] = useState(null);

  const highlightArrow = (direction) => {
    setHighlighted(direction);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const renderArrow = (direction, icon) => (
    <TouchableOpacity onPress={() => highlightArrow(direction)} style={styles.arrowButton1}>
      <Animated.View style={[styles.arrowContainer, highlighted === direction && styles.highlightedArrow, { transform: [{ scale: highlighted === direction ? scaleAnim : 1 }] }]}>
        <Icon name={icon} size={30} color="#7B7D7D" />
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton}><Text style={{ color: "#000" }}>✖️</Text></TouchableOpacity>
        <Text style={styles.headerText}>Qutab Golf course</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('GolfScorecard')}>
          <FontAwesome5 name="list-alt" color="#000" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}><FontAwesome5 name="user-tag" color="#000" size={18} /></TouchableOpacity>
      </View>

      {/* Hole Details */}
      <View style={styles.holeDetails}>
        <TouchableOpacity onPress={prevHole} style={styles.arrowButton}>
          <Icon name="keyboard-arrow-left" size={40} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.holeNumber}>{hole}</Text>
        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>YARDS</Text>
          <Text style={styles.detailValue}>{yards}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>PAR</Text>
          <Text style={styles.detailValue}>{par}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>INDEX</Text>
          <Text style={styles.detailValue}>{index}</Text>
        </View>
        <TouchableOpacity onPress={nextHole} style={styles.arrowButton}>
          <Icon name="keyboard-arrow-right" size={40} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Player Info */}
      <View style={{ padding: 20 }}>
        <View style={{ backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 20 }}>
          <View style={styles.playerCard}>
            <Image source={{ uri: 'https://s.cafebazaar.ir/images/upload/screenshot/com.laknaidriapps.girlscartoon-75f60f39-19e6-4ebf-ab92-2e30a3e8797b.jpeg?x-img=v1/resize,h_600,lossless_false/optimize' }} style={styles.playerImage} />
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>Ankit Bansal</Text>
              <Text style={styles.playerDetails}>HCAP 4 | Total: 0 (0)</Text>
            </View>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{currentScore} {currentPutts}</Text>
            </View>
            <TouchableOpacity onPress={() => setHide(!hide)} style={styles.toggleButton}>
              <Icon name={hide ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={30} color="#2C3E50" />
            </TouchableOpacity>
          </View>
          {hide && (
            <View>
              <View style={styles.appContainer}>
                <CircleWithArrows label="FR" />
                <CircleWithArrows label="GIR" />
              </View>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text>✔️</Text>
                  <Text style={styles.statTitle}>SANDIE</Text>
                </View>
                <View style={styles.statItem}>
                  <Text>✔️</Text>
                  <Text style={styles.statTitle}>UP/DOWN</Text>
                </View>
                <View style={styles.statItem}>
                  <Text>0</Text>
                  <Text style={styles.statTitle}>PENALTY</Text>
                </View>
              </View>

              {/* Score and Putts */}
              <View style={styles.counterContainer}>
                <View style={styles.counterItem}>
                  <Text style={styles.counterTitle}>Score</Text>
                  <View style={styles.counterControls}>
                    <TouchableOpacity onPress={() => handleScoreChange(hole, -1)} style={styles.button}><Text style={{ color: "#fff" }}>-</Text></TouchableOpacity>
                    <Text style={styles.counterText}>{currentScore}</Text>
                    <TouchableOpacity onPress={() => handleScoreChange(hole, 1)} style={styles.button}><Text style={{ color: "#fff" }}>+</Text></TouchableOpacity>
                  </View>
                </View>
                <View style={styles.counterItem}>
                  <Text style={styles.counterTitle}>Putts</Text>
                  <View style={styles.counterControls}>
                    <TouchableOpacity onPress={() => handlePuttsChange(hole, -1)} style={styles.button}><Text style={{ color: "#fff" }}>-</Text></TouchableOpacity>
                    <Text style={styles.counterText}>{currentPutts}</Text>
                    <TouchableOpacity onPress={() => handlePuttsChange(hole, 1)} style={styles.button}><Text style={{ color: "#fff" }}>+</Text></TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.sharingText}>🔴 Sharing Scores!</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EAEFF5',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04, // Responsive padding
    borderRadius: 10,
  },
  headerText: {
    fontSize: width * 0.045, // Responsive font size
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: width * 0.0125, // Responsive padding
    color: '#000',
  },
  menuButton: {
    padding: width * 0.0125, // Responsive padding
    color: '#0F1820',
  },
  holeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C2833',
    padding: width * 0.04, // Responsive padding
    width: '100%',
    marginBottom: height * 0.0125, // Responsive margin
  },
  holeNumber: {
    fontSize: width * 0.075, // Responsive font size
    fontWeight: 'bold',
    color: '#000000',
    marginHorizontal: width * 0.01, // Responsive margin
    backgroundColor: '#fff',
    borderRadius: width * 0.125, // Responsive border radius
    width: width * 0.125, // Responsive width
    height: width * 0.125, // Responsive height
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  detailContainer: {
    alignItems: 'center',
    marginHorizontal: width * 0.025, // Responsive margin
  },
  detailText: {
    fontSize: width * 0.035, // Responsive font size
    color: '#AAB7B8',
  },
  detailValue: {
    fontSize: width * 0.045, // Responsive font size
    fontWeight: 'bold',
    color: '#FFF',
  },
  arrowButton: {
    padding: width * 0.0125, // Responsive padding
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.04, // Responsive padding
    borderRadius: 10,
    marginBottom: height * 0.025, // Responsive margin
    justifyContent: 'space-between',
  },
  playerImage: {
    width: width * 0.125, // Responsive width
    height: width * 0.125, // Responsive height
    borderRadius: width * 0.0625, // Responsive border radius
  },
  playerName: {
    fontSize: width * 0.045, // Responsive font size
    fontWeight: 'bold',
    color: '#000000',
  },
  playerDetails: {
    fontSize: width * 0.035, // Responsive font size
    color: '#095290',
  },
  scoreCircle: {
    backgroundColor: '#fff',
    borderRadius: width * 0.125, // Responsive border radius
    padding: width * 0.03, // Responsive padding
    borderWidth: 2,
  },
  scoreText: {
    fontSize: width * 0.045, // Responsive font size
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: height * 0.03, // Responsive margin
    borderBottomWidth: 1,
    color: '#D3D3D3',
  },
  statItem: {
    alignItems: 'center',
    marginBottom: height * 0.0125, // Responsive margin
  },
  statTitle: {
    fontSize: width * 0.035, // Responsive font size
    fontWeight: 'bold',
    color: '#566573',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.025, // Responsive margin
  },
  counterItem: {
    alignItems: 'center',
  },
  counterTitle: {
    fontSize: width * 0.04, // Responsive font size
    fontWeight: 'bold',
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3B5062',
    marginHorizontal: width * 0.025, // Responsive margin
    borderRadius: width * 0.065, // Responsive border radius
    width: width * 0.065, // Responsive width
    height: width * 0.065, // Responsive height
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: width * 0.085, // Responsive font size
    fontWeight: 'bold',
    color: '#3B5062',
  },
  sharingText: {
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold',
  },
  circle: {
    width: width * 0.5, // Responsive width
    height: width * 0.5, // Responsive height
    borderRadius: width * 0.25, // Responsive border radius
    backgroundColor: '#EAEDED',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centerText: {
    position: 'absolute',
    fontSize: width * 0.045, // Responsive font size
    fontWeight: 'bold',
    color: '#566573',
  },
  arrowButton1: {
    position: 'absolute',
    padding: width * 0.025, // Responsive padding
  },
  arrowContainer: {
    padding: width * 0.025, // Responsive padding
    borderRadius: width * 0.075, // Responsive border radius
  },
  highlightedArrow: {
    backgroundColor: '#D4EFDF',
  },
  up: {
    top: height * 0.025, // Responsive position
  },
  down: {
    bottom: height * 0.025, // Responsive position
  },
  left: {
    left: width * 0.025, // Responsive position
  },
  right: {
    right: width * 0.025, // Responsive position
  },
  appContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default GolfScorecardScreen;
