import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const CircleWithArrows = ({ label, isFR }) => {
  const [highlighted, setHighlighted] = useState(null);

  const handlePress = (section) => {
    setHighlighted(section);
  };

  const circleSize = width * 0.4; // Responsive circle size

  return (
    <View style={styles.container}>
      <Svg height={circleSize} width={circleSize} viewBox="0 0 150 150">
        {/* Outer Circle */}
        <Circle cx="75" cy="75" r="70" fill="#E8F0F5" />

        {/* Highlighted Sections */}
        {highlighted === 'top' && <Path d="M75 75 L75 10 A65 65 0 0 1 140 75 Z" fill="#C4E17F" />}
        {highlighted === 'left' && <Path d="M75 75 L10 75 A65 65 0 0 1 75 10 Z" fill="#C4E17F" />}
        {highlighted === 'right' && <Path d="M75 75 L140 75 A70 70 0 0 0 75 10 Z" fill="#C4E17F" />}
        {highlighted === 'bottom' && <Path d="M75 75 L75 140 A65 65 0 0 1 10 75 Z" fill="#C4E17F" />}

        {/* Center Circle */}
        <Circle cx="75" cy="75" r="20" fill="white" stroke="black" strokeWidth="1" />
      </Svg>

      {/* Label */}
      <Text style={[styles.centerText, { top: circleSize / 2 - 10, left: circleSize / 2 - 15 }]}>{label}</Text>

      {/* All Arrows */}
      <View style={[styles.arrowContainer, { width: circleSize, height: circleSize }]}>
        {/* Top Arrow - Same for all languages */}
        <TouchableOpacity onPress={() => handlePress('top')} style={[styles.arrow, styles.topArrow, { top: circleSize * 0.06 }]}>
          <Image
            source={require('../Image/go-to-top.png')}
            style={{ width: circleSize * 0.24, height: circleSize * 0.24 }}
            tintColor="#959595"
          />
        </TouchableOpacity>

        {/* Left Arrow - Same for all languages */}
        <TouchableOpacity onPress={() => handlePress('left')} style={[styles.arrow, styles.leftArrow, { left: circleSize * 0.1 }]}>
          <Image
            source={require('../Image/leftarrow.png')}
            style={{ width: circleSize * 0.2, height: circleSize * 0.2 }}
            tintColor="#959595"
          />
        </TouchableOpacity>

        {label === 'GIR' && (
          <>
            {/* Right Arrow - Changed for French */}
            <TouchableOpacity onPress={() => handlePress('right')} style={[styles.arrow, styles.rightArrow, { right: circleSize * 0.06 }]}>
              {isFR ? (
                <Image
                  source={require('../Image/../Image/downArrow.png')}
                  style={{ width: circleSize * 0.33, height: circleSize * 0.33 }}
                  tintColor="#959595"
                />
              ) : (
                <Image
                  source={require('../Image/right-arrow.png')}
                  style={{ width: circleSize * 0.26, height: circleSize * 0.26 }}
                  tintColor="#959595"
                />
              )}
            </TouchableOpacity>

            {/* Bottom Arrow - Changed for French */}
            <TouchableOpacity onPress={() => handlePress('bottom')} style={[styles.arrow, styles.bottomArrow, { top: circleSize * 0.49 }]}>
              {isFR ? (
                <Image
                  source={require('../Image/../Image/downArrow.png')}
                  style={{ width: circleSize * 0.66, height: circleSize * 0.66 }}
                />
              ) : (
                <Image
                  source={require('../Image/downArrow.png')}
                  style={{ width: circleSize * 0.6, height: circleSize * 0.6 }}
                />
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerText: {
    position: 'absolute',
    fontSize: width * 0.035, // Responsive font size
    fontWeight: 'bold',
    zIndex: 10,
  },
  arrowContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    position: 'absolute',
    borderRadius: 50,
    padding: 0,
  },
  topArrow: {
    top: 10,
  },
  leftArrow: {
    left:16,
  },
  rightArrow: {
    right: 10,
  },
  bottomArrow: {
    top: 74,
  },
});

export default CircleWithArrows;