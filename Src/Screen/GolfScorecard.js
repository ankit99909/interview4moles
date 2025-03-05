import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Orientation from 'react-native-orientation-locker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const CELL_WIDTH = width * 0.12; // Responsive cell width
const ROW_LABEL_WIDTH = width * 0.3;

const parData = [4, 4, 4, 4, 4, 3, 4, 5, 4, 36, 4, 4, 4, 4, 4, 3, 4, 5, 4, 34, 70];
const yardData = [420, 314, 324, 295, 368, 182, 365, 513, 327, 3108, 116, 316, 400, 150, 154, 319, 493, 410, 305, 2663, 5771];
const indexData = [1, 17, 11, 15, 7, 13, 3, 5, 9, 81, 18, 12, 10, 14, 6, 8, 4, 2, 16];

const Table = ({ navigation }) => {
  const [showYardIndex, setShowYardIndex] = useState(false);
  const [showPlayerStats, setShowPlayerStats] = useState(false);
  const [datascore, setdatascore] = useState();
  const [gayanScore, setGayanScore] = useState({});
  const [kanishScore, setKanishScore] = useState({});
  const [showKanishStats, setShowKanishStats] = useState(false);
  const [omshahScore, setOmshahScore] = useState({});
  const [showOmshahStats, setShowOmshahStats] = useState(false);
  const [] =useState({})
  const [showGayanStats, setShowGayanStats] = useState(false);
  const [firData] = useState(['✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '100%', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '100%', '100%']);
  const [regData] = useState(['✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '100%', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '100%', '100%']);
  const [upDownData] = useState(Array(21).fill('-'));
 useEffect(() => {
     getData()
     Orientation.lockToLandscape();
 
     return () => {
       Orientation.unlockAllOrientations();
     };
   }, []);

  const headers = ['Hole', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'OUT', '10', '11', '12', '13', '14', '15', '16', '17', '18', 'IN', 'Total'];

  const getData = async () => {
    try {
      const golfScores = await AsyncStorage.getItem('golfScores');
      const golfPutts = await AsyncStorage.getItem('golfPutts');
      const golfPenalty = await AsyncStorage.getItem('golfPenalty');
      const parsedScores = golfScores ? JSON.parse(golfScores) : {};
      const parsedPutts = golfPutts ? JSON.parse(golfPutts) : {};
      const parsedPenalty = typeof JSON.parse(golfPenalty) === 'number' ? JSON.parse(golfPenalty) : 0;
      const scoreValue = Object.values(parsedScores)[0] || 0;
      const puttValue = Object.values(parsedPutts)[0] || 0;
      const penaltyValue = typeof parsedPenalty === "number" ? parsedPenalty : 0;

      const historyString = await AsyncStorage.getItem('golfDataHistory');
      const historyArray = historyString ? JSON.parse(historyString) : [];

      historyArray.push({
        score: scoreValue,
        putt: puttValue,
        penalty: penaltyValue,
      });

      await AsyncStorage.setItem('golfDataHistory', JSON.stringify(historyArray));
      const historydata = await AsyncStorage.getItem('golfDataHistory');
      setdatascore(historydata);

      const newGayanScore = {};
      const newKanishScore = {};
      const newOmshahScore = {};
      for (let i = 0; i < parData.length; i++) {
        newGayanScore[i] = Math.floor(Math.random() * 5) + 1;
        newKanishScore[i] = Math.floor(Math.random() * 5) + 1;
        newOmshahScore[i] = Math.floor(Math.random() * 5) + 1;
      }
      setGayanScore(newGayanScore);
      setKanishScore(newKanishScore);
      setOmshahScore(newOmshahScore);

      return historyArray;
    } catch (error) {
      console.error("Data processing failed:", error);
      return [];
    }
  };

  const titles = [];
  if (showYardIndex) {
    titles.push('Par', 'Yard', 'Index');
  } else {
    titles.push('Par');
  }
  titles.push('Dinesh Thakur');
  if (showPlayerStats) {
    titles.push('Putts', 'FIR', 'REG', 'Up/Down', 'PENALTY');
  }
  titles.push( 'Gayan Raja','Kanish Garg', 'Omshah', );

  const getCellValue = (title, colIndex) => {
    const parsedData = datascore ? JSON.parse(datascore) : [];
    switch (title) {
      case 'Par':
        return parData[colIndex];
      case 'Yard':
        return yardData[colIndex];
      case 'Index':
        return indexData[colIndex] ?? '-';
      case 'Dinesh Thakur': {
        const score = parsedData[colIndex]?.score ?? '0';
        const numericScore = parseInt(score, 10) || 0;
        return numericScore.toString();
      }
      case 'Gayan Raja':
        return gayanScore[colIndex]?.toString() || '0';
        case 'Kanish Garg':
          return kanishScore[colIndex]?.toString() || '0';
        case 'Omshah':
          return omshahScore[colIndex]?.toString() || '0';
      case 'Putts':
        return parsedData[colIndex]?.putt ?? '0';
      case 'PENALTY':
        return parsedData[colIndex]?.penalty ?? '0';
        case 'FIR':
          return firData[colIndex] ?? '-';
        case 'REG':
          return regData[colIndex] ?? '-';
        case 'Up/Down':
          return upDownData[colIndex] ?? '-';
        default:
        return '0';
    }
  };

  const handleBackPress = () => {
    if (navigation) {
      navigation.goBack();
    } else {
      console.log('Back button pressed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" color="#fff" size={30} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Score Card - 2025-02-27 - Sunset Golf Club</Text>
      </View>
      <ScrollView>
        <View style={styles.tableWrapper}>
          <View style={styles.fixedColumn}>
            <View style={[styles.holeHeaderCell, styles.holeheader]}>
              <Text style={styles.headerText}>Hole</Text>
            </View>
            {titles.concat([]).map((title, index) => (
                      <View key={`row-title-${index}`} style={[styles.rowLabel, title === 'Par' && { backgroundColor: '#d6d6d6' },
                      title === 'Dinesh Thakur' && { backgroundColor: '#f4f4f4' },
                      title === 'Gayan Raja' && { backgroundColor: '#f4f4f4' },
                      title === 'Kanish Garg' && { backgroundColor: '#f4f4f4' },
                      title === 'Omshah' && { backgroundColor: '#f4f4f4' }]}>
                          {title === 'Par' ? (
                              <View style={styles.labelContainer}>
                                  <TouchableOpacity
                                      onPress={() => setShowYardIndex(!showYardIndex)}
                                      style={[styles.plusButton, {
                                          backgroundColor: showYardIndex ? '#DC3735' : '#ACDB32',
                                          right: width * 0.16 ,
                                          top: -24
                                      }]}
                                  >
                                      <Ionicons
                                          name={showYardIndex ? 'remove' : 'add'}
                                          size={18}
                                          color="#fff"
                                      />
                                  </TouchableOpacity>
                                  <Text style={[styles.labelText, {
                                      fontWeight: "bold",
                                      textAlign: "left",
                                      right: 20,
                                      fontSize: 15,
                                      color: "#333333",
                                  }]}>{title}</Text>
                              </View>
                          ) : (title === 'Dinesh Thakur' || title === "Gayan Raja" || title === 'Kanish Garg' || title === 'Omshah') ? (
                              <View style={styles.labelContainer}>
                                  <TouchableOpacity
                                      onPress={() => {
                                          if (title === 'Dinesh Thakur') setShowPlayerStats(!showPlayerStats);
                                          else if (title === 'Gayan Raja') setShowGayanStats(!showGayanStats);
                                          else if (title === 'Kanish Garg') setShowKanishStats(!showKanishStats);
                                          else if (title === 'Omshah') setShowOmshahStats(!showOmshahStats);
                                      }}
                                      style={[styles.plusButton, {
                                          backgroundColor: (title === 'Dinesh Thakur' ? showPlayerStats : title === 'Gayan Raja' ? showGayanStats : title === 'Kanish Garg' ? showKanishStats : showOmshahStats) ? '#DC3735' : '#ACDB32',
                                          right: width * (
                                            title === 'Dinesh Thakur' ? 0.24 :    // ~30px on 375px width
                                            title === 'Gayan Raja' ? 0.21 :       // ~16px on 375px width 
                                            title === 'Kanish Garg' ? 0.22 :      // ~14px on 375px width
                                            title === 'Omshah' ? 0.19 :           // ~28px on 375px width
                                            0.03                                  // default 16px
                                          )
                                        }]}
                                  >
                                      <Ionicons
                                          name={(title === 'Dinesh Thakur' ? showPlayerStats : title === 'Gayan Raja' ? showGayanStats : title === 'Kanish Garg' ? showKanishStats : showOmshahStats) ? 'remove' : 'add'}
                                          size={18}
                                          color="#fff"
                                      />
                                  </TouchableOpacity>
                                  <Text style={[styles.labelText, {
                                    left:title ==="Dinesh Thakur"&&width * 0.010,
                                     fontFamily: "Roboto-Medium",
                                     fontWeight: "700",
                                     right: width * 0.027, // ~10px on 375px width screen
                                     fontSize: width * 0.034, // ~16px on 375px width screen
                                     color: "#333333",
                                     textAlign: "center", // Center align text
                                     textAlignVertical: "center", // Vertical center for Android
                                     includeFontPadding: false // Remove extra font padding
                                  }]}>{title}</Text>
                              </View>
                          ) : (
                              <Text style={styles.labelText}>{title}</Text>
                          )}
                      </View>
                  ))}

          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <View style={styles.scrollableHeaderRow}>
                {headers.slice(1).map((header, index) => (
                  <View
                    key={`header-${index}`}
                    style={[
                      styles.headerCell,
                      (header === 'OUT' || header === 'IN') && styles.outInHeader,
                      index === 0 && styles.firstScrollableHeader,
                    ]}
                  >
                    <Text style={styles.headerText}>{header}</Text>
                  </View>
                ))}
              </View>

              {titles.concat([]).map((title, rowIndex) => (
    <View key={`row-${rowIndex}`} style={styles.scrollableDataRow}>
        {headers.slice(1).map((header, colIndex) => {
            let backgroundColor = 'transparent';
            let textColor = '#333333';
            let score = getCellValue(title, colIndex);

            if (title === 'Dinesh Thakur' || title === 'Gayan Raja' || title === 'Kanish Garg' || title === 'Omshah') {
                const parsedData = datascore ? JSON.parse(datascore) : [];
                const numericScore = parseInt((title === 'Dinesh Thakur' ? parsedData[colIndex]?.score : title === 'Gayan Raja' ? gayanScore[colIndex] : title === 'Kanish Garg' ? kanishScore[colIndex] : omshahScore[colIndex]) || '0', 10) || 0;
                const par = parData[colIndex] || 0;
                const relativeScore = numericScore - par;
                if (relativeScore <= -2) {
                    backgroundColor = '#ffffff';
                } else if (relativeScore === -1) {
                    backgroundColor = '#E74C3C';
                    textColor = '#fff';
                } else if (relativeScore === 1) {
                    backgroundColor = '#3498DB';
                    textColor = '#fff';
                } else if (relativeScore >= 2) {
                    backgroundColor = '#000000';
                    textColor = '#fff';
                }
            }

            if (colIndex === 9 && (title === 'Dinesh Thakur' || title === 'Gayan Raja' || title === 'Kanish Garg' || title === 'Omshah')) {
                let total = 0;
                for (let i = 1; i <= 8; i++) {
                    const parsedData = datascore ? JSON.parse(datascore) : [];
                    total += parseInt((title === 'Dinesh Thakur' ? parsedData[i]?.score : title === 'Gayan Raja' ? gayanScore[i] : title === 'Kanish Garg' ? kanishScore[i] : omshahScore[i]) || '0', 10) || 0;
                }
                score = total.toString();
            }

            if (colIndex === headers.slice(1).length - 1 && (title === 'Dinesh Thakur' || title === 'Gayan Raja' || title === 'Kanish Garg' || title === 'Omshah')) {
                let total = 0;
                const parsedData = datascore ? JSON.parse(datascore) : [];
                for (let i = 1; i < headers.slice(1).length - 1; i++) {
                    total += parseInt((title === 'Dinesh Thakur' ? parsedData[i]?.score : title === 'Gayan Raja' ? gayanScore[i] : title === 'Kanish Garg' ? kanishScore[i] : omshahScore[i]) || '0', 10) || 0;
                }
                score = total.toString();
            }
            return (
                <View
                    key={`cell-${rowIndex}-${colIndex}`}
                    style={[
                        styles.cell,
                        (colIndex === 9 || colIndex === 19) && styles.outInCell,
                        colIndex === 20 && styles.totalCell,
                        colIndex === 0 && styles.firstScrollableCell,
                        {
                            backgroundColor:
                                (colIndex === 9 || colIndex === 19)
                                    ? '#253C51'
                                    : title === 'Par'
                                        ? '#d6d6d6'
                                        : '#fff',
                        },]} >
                    {(title === 'Dinesh Thakur' || title === 'Gayan Raja' || title === 'Kanish Garg' || title === 'Omshah') ? (
                        <View style={[styles.scoreCircle, {
                            backgroundColor, backgroundColor:
                                (colIndex === 9 || colIndex === 19)
                                    ? '#253C51' : backgroundColor,
                        }]}>
                            <Text style={[styles.cellText, {
                                color: textColor, color:
                                    (colIndex === 9 || colIndex === 19)
                                        ? '#ffffff'
                                        : textColor,
                            }]}>
                                {score}
                            </Text>
                        </View>
                    ) : (
                        <Text style={[
                            styles.cellText,
                            {
                                color:
                                    (colIndex === 9 || colIndex === 19)
                                        ? '#fff'
                                        : title === 'Par'
                                            ? '#333333'
                                            : '#888888',
                                backgroundColor: (title === 'Kanish Garg' || title === 'Omshah') ? backgroundColor : 'transparent',
                                color: (title === 'Kanish Garg' || title === 'Omshah') ? textColor : (colIndex === 9 || colIndex === 19) ? '#fff' : title === 'Par' ? '#333333' : '#888888',
                            },
                        ]}>
                            {score}
                        </Text>
                    )}
                </View>
            );
        })}
    </View>
))}
            </View>
          </ScrollView>
        </View>
        <View style={{ padding: 20, justifyContent: "center", alignItems: "center" }}>
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
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
  },
  backButton: {
    marginRight: width * 0.03,
  },
  headerTitle: {
    fontSize: width * 0.04,
    color: 'white',
    marginLeft: width * 0.02,
    textAlign: 'center',
    flexShrink: 1,
  },
  tableWrapper: {
    flex: 1,
    padding: width * 0.09,
    flexDirection: 'row',
  },
  fixedColumn: {
    width: ROW_LABEL_WIDTH,
    zIndex: 1,
  },
  holeHeaderCell: {
    height: height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#ddd',
    borderTopStartRadius: width * 0.02,
    backgroundColor: '#4f4f4f',
  },
  rowLabel: {
    width: ROW_LABEL_WIDTH,
    height: height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.02,
  },
  labelText: {
    color: '#888888',
    fontSize: width * 0.035,
    flexShrink: 1,
  },
  cellText: {
    fontSize: width * 0.035,
    textAlign: 'center',
    color: '#34495e',
  },
  scrollableHeaderRow: {
    flexDirection: 'row',
    marginLeft: -1,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  headerCell: {
    width: CELL_WIDTH,
    height: height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#4F4f4f',
  },
  headerText: {
    fontSize: width * 0.035,
    color: '#fff',
    textAlign: 'center',
  },
  scrollableDataRow: {
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderColor: '#ddd',
  },
  cell: {
    width: CELL_WIDTH,
    height: height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderBottomWidth: 1,
  },
  outInCell: {
    backgroundColor: '#253C51',
  },
  plusButton: {
    marginRight: width * 0.02,
    borderRadius: width * 0.1,
    // width: width * 0.06,
    // height: width * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  legend: {
    flexDirection: 'row',
    justifyContent:"space-around",
    marginTop: height * 0.02,
    marginHorizontal: width * 0.03,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: width * 0.01,
  },
  legendColor: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: width * 0.01,
    marginRight: width * 0.01,
  },
  legendText: {
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
  scoreCircle: {
    width: width * 0.06,
    height: width * 0.06,
    borderRadius: width * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
  },
  holeheader: {
    borderTopStartRadius: width * 0.02,
  },
});

export default Table;


