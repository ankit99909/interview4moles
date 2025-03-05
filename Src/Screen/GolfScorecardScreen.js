import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Animated, Dimensions } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CircleWithArrows from '../Componets/CircleWithArrows';
import AntDesign from 'react-native-vector-icons/AntDesign';

const { width, height } = Dimensions.get('window');


// Helper functions for responsive scaling
const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (height / 667) * size;
const responsiveFont = (size) => Math.round((size * width) / 375);

const holesData = Array.from({ length: 18 }, (_, i) => {
  const holeNumber = i + 1;
  const dataIndex = holeNumber <= 9 ? i : i + 1;
  return {
    hole: holeNumber,
    yards: 200 + (i * 10),
    par: 3 + (i % 5),
    index: 12 - (i % 12),
  };
});

const GolfScorecardScreen = ({ navigation }) => {
  const [scores, setScores] = useState({});
  const [putts, setPutts] = useState({});
  const [currentHoleIndex, setCurrentHoleIndex] = useState(0);
  const [hide, setHide] = useState(true);
  const [penalty, setPenalty] = useState(0);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    const loadData = async () => {
      try {
        const storedScores = await AsyncStorage.getItem('golfScores');
        const storedPutts = await AsyncStorage.getItem('golfPutts');
        const storedPenalty = await AsyncStorage.getItem('golfPenalty');

        if (storedScores) setScores(JSON.parse(storedScores));
        if (storedPutts) setPutts(JSON.parse(storedPutts));
        if (storedPenalty) setPenalty(parseInt(storedPenalty, 10) || 0);

      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('golfScores', JSON.stringify(scores));
        await AsyncStorage.setItem('golfPutts', JSON.stringify(putts));
        await AsyncStorage.setItem('golfPenalty', penalty.toString());

        if (isConnected) {
          // Simulate sending data to server (replace with your actual server logic)
          console.log('Sending data to server:', { scores, putts, penalty });
        }
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    saveData();
  }, [scores, putts, penalty, isConnected]);

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

  const penaltyButton = () => {
    setPenalty(penalty + 1);
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
          <Image
            source={require('../Image/header.png')}
            style={{ 
              width: responsiveWidth(46), 
              height: responsiveWidth(46), 
              left: responsiveWidth(24) 
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}><FontAwesome5 name="user-tag" color="#000" size={18} /></TouchableOpacity>
      </View>

      {/* Hole Details */}
      <View style={styles.holeDetails}>
        <TouchableOpacity onPress={prevHole} style={[styles.arrowButton, {left: -responsiveWidth(8)}]}>
          <Icon name="keyboard-arrow-left" size={44} color="#fff" />
        </TouchableOpacity>
        <View style={{backgroundColor:"#fff", borderRadius: width * 0.125, // Responsive border radius
    width: width * 0.160, 
    height: width * 0.160,justifyContent:"center",alignItems:"center" }}>
        <Text style={styles.holeNumber}>{hole}</Text>
        </View>
       
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
        <TouchableOpacity onPress={nextHole} style={[styles.arrowButton,{}]}>
          <Icon name="keyboard-arrow-right" size={44} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Player Info */}
      <View style={{ padding: 20 }}>
        <View style={{ backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10 }}>
          <View style={styles.playerCard}>
            <Image
              source={require('../Image/profile.png')}
              style={styles.playerImage}
            />
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>Ankit Bansal</Text>
              <Text style={styles.playerDetails}>HCAP 4 | Total: 0 (0)</Text>
            </View>
            <View style={styles.scoreCircle}>
  <Text style={styles.scoreText}>
    <Text style={styles.largeScore}>{currentScore}</Text>
    <Text style={styles.smallPutts}> {currentPutts}</Text>
  </Text>
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
                <TouchableOpacity style={styles.statItem}>
                  <AntDesign name="check" color="#969696" size={40} />
                  <Text style={styles.statTitle}>SANDIE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statItem}>
                  <AntDesign name="check" color="#969696" size={40} />
                  <Text style={styles.statTitle}>UP/DOWN</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statItem} onPress={() => penaltyButton()}>
                  <Text style={styles.textstyle}>{penalty}</Text>
                  <Text style={styles.statTitle}>PENALTY</Text>
                </TouchableOpacity>
              </View>

              {/* Score and Putts */}
              <View style={styles.counterContainer}>
                <View style={styles.counterItem}>
                  <Text style={styles.counterTitle}>Score</Text>
                  <View style={styles.counterControls}>
                    <TouchableOpacity onPress={() => handleScoreChange(hole, -1)} style={styles.button}><Text style={{ color: "#fff",fontWeight:"bold",fontSize:16 }}>-</Text></TouchableOpacity>
                    <Text style={styles.counterText}>{currentScore}</Text>
                    <TouchableOpacity onPress={() => handleScoreChange(hole, 1)} style={styles.button}><Text style={{ color: "#fff",fontWeight:"bold",fontSize:16 }}>+</Text></TouchableOpacity>
                  </View>
                </View>
                <View style={styles.counterItem}>
                  <Text style={styles.counterTitle}>Putts</Text>
                  <View style={styles.counterControls}>
                    <TouchableOpacity onPress={() => handlePuttsChange(hole, -1)} style={styles.button}><Text style={{ color: "#fff",fontWeight:"bold",fontSize:16 }}>-</Text></TouchableOpacity>
                    <Text style={styles.counterText}>{currentPutts}</Text>
                    <TouchableOpacity onPress={() => handlePuttsChange(hole, 1)} style={styles.button}><Text style={{color: "#fff",fontWeight:"bold",fontSize:16 }}>+</Text></TouchableOpacity>
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
      height: responsiveHeight(48),
      padding: responsiveWidth(10),
      borderRadius: responsiveWidth(10),
    },
    headerText: {
      fontSize: responsiveFont(18),
      fontWeight: 'bold',
      color: '#000',
    },
    closeButton: {
      padding: responsiveWidth(10),
    },
    menuButton: {
      padding: responsiveWidth(10),
    },
    holeDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#1C2833',
      padding: responsiveWidth(20),
      height: responsiveHeight(62),
    },
    holeNumber: {
      fontSize: responsiveFont(30),
      fontWeight: 'bold',
      color: '#000000',
      backgroundColor: '#fff',
      borderRadius: responsiveWidth(30),
      width: responsiveWidth(60),
      height: responsiveWidth(60),
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    detailContainer: {
      alignItems: 'center',
      marginHorizontal: responsiveWidth(10),
    },
    detailText: {
      fontSize: responsiveFont(12),
      color: '#ffffff',
    },
    detailValue: {
      fontSize: responsiveFont(18),
      fontWeight: 'bold',
      color: '#FFF',
    },
    playerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: responsiveWidth(15),
      borderRadius: responsiveWidth(10),
      marginBottom: responsiveHeight(10),
      justifyContent: 'space-between',
    },
    playerImage: {
      width: responsiveWidth(46),
      height: responsiveWidth(46),
      borderRadius: responsiveWidth(23),
    },
    playerInfo: {
      marginLeft: responsiveWidth(15),
      flex: 1,
    },
    playerName: {
      fontSize: responsiveFont(16),
      fontWeight: 'bold',
      color: '#000000',
    },
    playerDetails: {
      fontSize: responsiveFont(12),
      color: '#095290',
    },
    scoreCircle: {
      justifyContent: 'center',
      alignItems: 'center',
      width: responsiveWidth(50),
      height: responsiveWidth(50),
      borderRadius: responsiveWidth(25),
      borderWidth: 2,
      backgroundColor: '#f0f0f0',
    },
  scoreText: {
    flexDirection: 'row',
    alignItems: 'flex-end', // This aligns items at the bottom
  },
  largeScore: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#253C51'
  },
  smallPutts: {
    fontSize: 16,
    color: '#253C51',
    // Fine-tune alignment if needed
  },
  detailContainer: {
    alignItems: 'center',
    marginHorizontal: width * 0.025, // Responsive margin
  },
  detailText: {
    fontSize: width * 0.035, // Responsive font size
    color: '#ffffff',
  },
  detailValue: {
    fontSize: width * 0.050, // Responsive font size
    fontWeight: 'bold',
    color: '#FFF',
  },
  textstyle: {
    fontSize: width * 0.076, // Responsive font size
    fontWeight: 'bold',
    color: "#969696"
  },
  arrowButton: {
    justifyContent:"center",
    alignItems:"center",
    left:10
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.04, // Responsive padding
    borderRadius: 10,
    marginBottom: height * 0.01, // Responsive margin
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
 
  scoreText: {
    fontSize: width * 0.045, // Responsive font size
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: height * 0.03, // Responsive margin
    borderBottomWidth: 1.5,
    borderBlockColor: "#D3D3D3",
    color: '#D3D3D3',
  },
  statItem: {
    alignItems: 'center',
    marginBottom: height * 0.0125, // Responsive margin
  },
  statTitle: {
    fontSize: width * 0.044, // Responsive font size
    fontWeight: 'bold',
    color: '#000000',
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
    color: "#000000"
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
    justifyContent: "space-around",
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default GolfScorecardScreen;
