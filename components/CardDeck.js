import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler } from 'react-native-reanimated';

const CARD_HEIGHT = 100;
const CARD_WIDTH = '35%';
const OFFSET = 10;

function CardDeck({ updates }) {
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);
  
    const gestureHandler = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
        ctx.startY = translateY.value;
        ctx.startX = translateX.value;
      },
      onActive: (event, ctx) => {
        translateY.value = ctx.startY + event.translationY;
        translateX.value = ctx.startX + event.translationX;
  
        // Hide the card if it's swiped a certain distance.
        opacity.value = Math.max(1 - Math.abs(translateX.value) / 100, 0);
      },
      onEnd: () => {
        if (Math.abs(translateX.value) > 50) {
          opacity.value = withSpring(0, { stiffness: 500, damping: 1, mass: 1 });
        } else {
          translateY.value = withSpring(0);
          translateX.value = withSpring(0);
          opacity.value = withSpring(1);
        }
      },
    });
  
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateY: translateY.value },
          { translateX: translateX.value }
        ],
        opacity: opacity.value,
      };
    });
  
    return (
      <View style={styles.container}>
        {updates.slice(0).reverse().map((card, index) => (
          index === updates.length - 1 ? (
            <PanGestureHandler key={index} onGestureEvent={gestureHandler}>
              <Animated.View style={[styles.card, { top: OFFSET * index, left: OFFSET * index }, animatedStyle]}>
                <View style={styles.cardContent}>
                  <Text style={styles.title}>{card.title}</Text>
                  <Text style={styles.content}>{card.content}</Text>
                  <Text style={styles.date}>{new Date(card.timestamp?.seconds * 1000).toLocaleDateString()}</Text>
                </View>
              </Animated.View>
            </PanGestureHandler>
          ) : (
            <View key={index} style={[styles.card, { top: OFFSET * index, left: OFFSET * index }]}>
              <View style={styles.cardContent}>
                <Text style={styles.title}>{card.title}</Text>
                <Text style={styles.content}>{card.content}</Text>
                <Text style={styles.date}>{new Date(card.timestamp?.seconds * 1000).toLocaleDateString()}</Text>
              </View>
            </View>
          )
        ))}
      </View>
    );
  }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Android shadow
  },
  cardContent: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {},
  date: {
    fontSize: 12,
    color: '#888',
  },
});

export default CardDeck;
