import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PanGestureHandler, GestureHandlerRootView, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const data = {
  date: '2025-02-27',
  course: 'Sunset Golf Club',
  holes: ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'OUT', '10', '11', '12', '13', '14', '15', '16', '17', '18', 'IN', "TOTAL"],
  par: [4, 4, 3, 5, 4, 3, 4, 4, 5, '456', 4, 4, 3, 5, 4, 3, 4, 4, 5, '459', "70"],
  yard: [400, 380, 170, 500, 410, 190, 360, 370, 520, '456', 410, 400, 180, 510, 420, 200, 370, 380, 530, '459', '5771'],
  index: [10, 12, 16, 2, 8, 18, 14, 6, 4, '456', 9, 11, 15, 1, 7, 17, 13, 5, 3, '780'],
  players: [
    {
      name: 'Dinesh Thakur',
      scores: [4, 4, 3, 5, 4, 3, 4, 4, 5, '456', 4, 4, 3, 5, 4, 3, 4, 4, 5, '360', 70],
      putts: [2, 2, 1, 2, 2, 1, 2, 2, 2, '456', 2, 2, 1, 2, 2, 1, 2, 2, 2, '360', 70],
      fir: ['✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '100%', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '100%', '100%'],
      reg: ['✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '100%', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '100%', '100%'],
      upDown: [0, 0, 1, 0, 0, 1, 0, 0, 0, '456', 0, 0, 1, 0, 0, 1, 0, 0, 0, '360', 780],
      penalty: [0, 0, 0, 0, 0, 0, 0, 0, 0, '456', 0, 0, 0, 0, 0, 0, 0, 0, 0, '360', 200]
    }
  ]
};

const GolfScorecard = ({ navigation }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showPlayerDetails, setShowPlayerDetails] = useState(null);
  const widthArr = [100, ...data.holes.map((_, i) => (i === 20 ? 70 : 60))];
  const translateX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const [showHorizontalScrollIndicator, setShowHorizontalScrollIndicator] = useState(true);

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedScores = await AsyncStorage.getItem('@scores');
        const savedPutts = await AsyncStorage.getItem('@putts');
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadSavedData();
  }, []);

  const tableHead = [
    'HOLE',
    ...data.holes.map(hole => (
      <Text
        style={[
          styles.holeHeader,
          (hole === 'OUT' || hole === 'IN') && styles.redHeader
        ]}
        key={hole}
      >
        {hole}
      </Text>
    ))
  ];

  const renderCell = (value, index) => {
    const isSpecialCol = ['OUT', 'IN'].includes(data.holes[index]);
    return (
      <Text style={[styles.cellText, isSpecialCol && styles.redCell]}>
        {value}
      </Text>
    );
  };

  const parRow = [
    <View style={styles.parHeader} key="par">
      <Text style={styles.parLabel}>PAR</Text>
      <TouchableOpacity
        onPress={() => setShowDetails(!showDetails)}
        style={[
          styles.toggleButton,
          { backgroundColor: showDetails ? '#e74c3c' : '#ACDB32' }
        ]}
      >
        <Text style={styles.toggleText}>{showDetails ? '-' : '+'}</Text>
      </TouchableOpacity>
    </View>,
    ...data.par.map((par, i) => renderCell(par, i))
  ];

  const yardRow = ['YARD', ...data.yard.map((yard, i) => renderCell(yard, i))];
  const indexRow = ['INDEX', ...data.index.map((index, i) => renderCell(index, i))];

  const playerRows = data.players.flatMap((player, pi) => [
    [
      <TouchableOpacity
        key={`player-${pi}`}
        onPress={() => setShowPlayerDetails(showPlayerDetails === pi ? null : pi)}
        style={styles.playerHeader}
      >
        <Text style={styles.playerName}>{player.name}</Text>
        <View style={[
          styles.playerToggleButton,
          { backgroundColor: showPlayerDetails === pi ? '#e74c3c' : '#ACDB32' }
        ]}>
          <Text style={styles.playerToggleText}>
            {showPlayerDetails === pi ? '-' : '+'}
          </Text>
        </View>
      </TouchableOpacity>,
      ...player.scores.map((score, si) => renderCell(score, si))
    ],
    ...(showPlayerDetails === pi ? [
      ['PUTTS', ...player.putts.map((putt, i) => renderCell(putt, i))],
      ['FIR', ...player.fir.map((fir, i) => renderCell(fir, i))],
      ['REG', ...player.reg.map((reg, i) => renderCell(reg, i))],
      ['UP/DOWN', ...player.upDown.map((upDown, i) => renderCell(upDown, i))],
      ['PENALTY', ...player.penalty.map((penalty, i) => renderCell(penalty, i))]
    ].map((row, ri) => [
      <Text key={`row-label-${ri}`} style={styles.detailLabel}>{row[0]}</Text>,
    ]) : []),
  ]);

  const handleBackPress = () => {
    if (navigation) {
      navigation.goBack();
    } else {
      console.log('Back button pressed');
    }
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: false }
  );

 
  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;
      if (translationX < -50) {
        Animated.timing(translateX, {
          toValue: -width,
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else if (translationX > 50) {
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  const handleScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    setShowHorizontalScrollIndicator(scrollX === 0);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={showHorizontalScrollIndicator}
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.container, { transform: [{ translateX }] }]}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Ionicons name="chevron-back" color="#fff" size={30} />
            </TouchableOpacity>
            <Text style={styles.headertitle}>Score Card - {data.date} - {data.course}</Text>
          </View>

          <View style={{ padding: 20 }}>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd' }}>
              <Row
                data={tableHead}
                widthArr={widthArr}
                style={styles.header}
                textStyle={styles.headerText}
              />
              <Rows
                data={[
                  parRow,
                  ...(showDetails ? [yardRow, indexRow] : []),
                  ...playerRows
                ]}
                widthArr={widthArr}
                textStyle={styles.cellText}
              />
            </Table>
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#F1C40F' }]} />
                <Text style={styles.legendText}>Eagle/Better</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#E74C3C' }]} />
                <Text style={styles.legendText}>Birdie</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#3498DB' }]} />
                <Text style={styles.legendText}>Bogey</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#000000' }]} />
                <Text style={styles.legendText}>Double Bogey</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View style={[{ position: "absolute", width: width, height: height, zIndex: -1, transform: [{ translateX: translateX }] }]}>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  scrollView: {
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: width * 0.045, // Responsive font size
    fontWeight: 'bold',
    marginBottom: height * 0.02, // Responsive margin
    color: '#2c3e50',
    textAlign: 'center',
  },
  header: {
    height: height * 0.06, // Responsive height
    backgroundColor: '#4F4F4f',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: width * 0.025, // Responsive padding
    marginBottom: height * 0.0125, // Responsive margin
    height: height * 0.06, // Responsive height
  },
  backButton: {
    marginRight: width * 0.025, // Responsive margin
    borderRadius: 8,
  },
  headertitle: {
    flex: 1,
    fontSize: width * 0.035, // Responsive font size
    fontWeight: 'bold',
    color: 'white',
  },
  headerText: {
    fontSize: width * 0.035, // Responsive font size
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  redHeader: {
    backgroundColor: '#253C51',
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: height * 0.015, // Responsive padding
  },
  redCell: {
    backgroundColor: '#253C51',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: height * 0.015, // Responsive padding
  },
  parHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.025, // Responsive padding
  },
  parLabel: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  toggleButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    width: width * 0.06, // Responsive width
    height: width * 0.06, // Responsive height
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: width * 0.02, // Responsive margin
  },
  toggleText: {
    color: 'white',
    fontSize: width * 0.04, // Responsive font size
    fontWeight: 'bold',
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: width * 0.025, // Responsive padding
  },
  playerName: {
    fontSize: width * 0.04, // Responsive font size
    fontWeight: 'bold',
    color: '#34495e',
  },
  playerToggleButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    width: width * 0.06, // Responsive width
    height: width * 0.06, // Responsive height
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: width * 0.02, // Responsive margin
  },
  playerToggleText: {
    color: 'white',
    fontSize: width * 0.04, // Responsive font size
    fontWeight: 'bold',
  },
  cellText: {
    fontSize: width * 0.035, // Responsive font size
    textAlign: 'center',
    paddingVertical: height * 0.01875, // Responsive padding
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#2c3e50',
    paddingVertical: height * 0.01, // Responsive padding
    paddingLeft: width * 0.025, // Responsive padding
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.025, // Responsive margin
    marginHorizontal: width * 0.0125, // Responsive margin
    gap: width * 0.05, // Responsive gap
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: width * 0.05, // Responsive width
    height: width * 0.05, // Responsive height
    borderRadius: 10,
    marginRight: width * 0.0125, // Responsive margin
  },
  legendText: {
    fontSize: width * 0.035, // Responsive font size
    fontWeight: 'bold',
  },
  holeHeader: {
    backgroundColor: '#4f4f4f',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: height * 0.015, // Responsive padding
  },
  redHeader: {
    backgroundColor: '#253C51',
  },
  redCell: {
    backgroundColor: '#253C51',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: height * 0.015, // Responsive padding
  },
  scoreCell: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  scoreText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },
  swipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default GolfScorecard;
