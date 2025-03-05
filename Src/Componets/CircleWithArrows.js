import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import Svg, { Circle, Path ,Ellipse } from 'react-native-svg';

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
  <Circle cx="75" cy="75" r="52" fill="#E8F0F5" />  
  {/* Highlighted Sections */}
  {label === 'FR' ? (
    highlighted === 'top' && <Image source={require('../Image/top_right.png')} style={[{width: '56%',height:'62%',top:27,right:-43}]} tintColor="#C4E17F"/>
  ) : (
    highlighted === 'top' && <Image source={require('../Image/top.png')} style={[{width: '60%',height:'66%',top:26,right:-22}]} tintColor="#C4E17F"/>
  )}
  {label === 'FR' ? (
    highlighted === 'left' &&  <Image source={require('../Image/top_left.png')} style={[{width: '40%',height:'72%',top:27,right:-26}]} tintColor="#C4E17F"/>
  ) : (
    highlighted === 'left' &&  <Image source={require('../Image/left.png')} style={[{width: '42%',height:'74%',top:43,left:26}]} tintColor="#C4E17F"
/>
  )}
  
  {label === 'FR' ? (
    highlighted === 'right' && <Path d="M80 130 L140 140 A70 110 0 0 0 130 26 Z" fill="#C4E17F" />
  ) : (
    highlighted === 'right' &&  <Image source={require('../Image/right.png')} style={[{width: '40%',height:'74%',top:27,left:66}]} tintColor="#C4E17F"/>
  )}
  
  {highlighted === 'bottom' &&  <Image source={require('../Image/bottom.png')} style={[{width: '56%',height:'64%',top:64,left:42}]} tintColor="#C4E17F"/>}

  {/* Center Circle */}
  <Circle cx="75" cy="75" r="12" fill="white" stroke="#868B9F" strokeWidth="1.5" />
</Svg>
      {/* Label */}
      {label === 'GIR'? (
      <Text style={[styles.centerText, { top: circleSize / 2 - 8, left: circleSize / 2 - 10 }]}>{label}</Text>
      ):(
        <Text style={[styles.centerText, { top: circleSize / 2 - 8, left: circleSize / 2 - 7 }]}>{label}</Text>
      )}

      {/* All Arrows */}
      <View style={[styles.arrowContainer, { width: circleSize, height: circleSize }]}>
        {/* Top Arrow - Same for all languages */}
        <TouchableOpacity onPress={() => handlePress('top')} style={[styles.arrow, styles.topArrow, { top: circleSize * 0.20 }]}>
        {label === 'GIR'? (
          <Image
            source={require('../Image/go-to-top.png')} // Replace with your image path
            style={{ width: circleSize * 0.16, height: circleSize * 0.16 }}
            tintColor="#959595"
          />
        ):(
          <Image
          source={require('../Image/redo.png')} // Replace with your image path
          style={{ width: circleSize * 0.40, height: circleSize * 0.40 ,left:24,top:-10}}
          tintColor="#959595"
        />
        )}
        </TouchableOpacity>

        {/* Left Arrow - Same for all languages */}
        <TouchableOpacity onPress={() => handlePress('left')} style={[styles.arrow, styles.leftArrow, { left: circleSize * 0.22 }]}>
        {label === 'GIR'? (
          <Image
            source={require('../Image/leftarrow.png')} // Replace with your image path
            style={{ width: circleSize * 0.12, height: circleSize * 0.12 }}

            tintColor="#959595"
          />
        ):(
          <Image
          source={require('../Image/redo.png')} // Replace with your image path
          style={{ width: circleSize * 0.40, height: circleSize * 0.40 ,top:-24,right:10,transform: [{ scaleX: -1 }],}}
          tintColor="#959595"
           accessibilityLabel="Redo icon"
           importantForAccessibility="yes"
           
        />
        )}
        </TouchableOpacity>

        {label === 'GIR' && (
          <>
            {/* Right Arrow - Changed for French */}
            <TouchableOpacity onPress={() => handlePress('right')} style={[styles.arrow, styles.rightArrow, { right: circleSize * 0.20 }]}>
              {isFR ? (
                <Image
                  source={require('../Image/downArrow.png')} // Replace with your image path
                  style={{ width: circleSize * 0.12, height: circleSize * 0.12 }}
                  tintColor="#959595"
                />
              ) : (
                <Image
                  source={require('../Image/right-arrow.png')} // Replace with your image path
                  style={{ width: circleSize * 0.18, height: circleSize * 0.18 }}
                  tintColor="#959595"
                />
              )}
            </TouchableOpacity>

            {/* Bottom Arrow - Changed for French */}
            <TouchableOpacity onPress={() => handlePress('bottom')} style={[styles.arrow, styles.bottomArrow, { top: circleSize * 0.52 }]}>
              {isFR ? (
                <Image
                  source={require('../Image/downArrow.png')} // Replace with your image path
                  style={{ width: circleSize * 0.18, height: circleSize * 0.18 }}
                />
              ) : (
                <Image
                  source={require('../Image/downArrow.png')} // Replace with your image path
                  style={{ width: circleSize * 0.40, height: circleSize * 0.40 }}
                  tintColor="#959595"
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
    justifyContent:'space-between',
    position: 'relative',
  },
  centerText: {
    position: 'absolute',
    fontSize: width * 0.028, // Responsive font size
    fontWeight: 'bold',
    textAlign:"center",
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
    top: -50,
  },
  leftArrow: {
    left: 16,
  },
  rightArrow: {
    // right: 10,
  },
  bottomArrow: {
    // top: 74,
  },
});

export default CircleWithArrows;