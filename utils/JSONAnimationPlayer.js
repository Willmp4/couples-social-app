import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet, Dimensions } from 'react-native';

const JSONAnimationPlayer = ({ animationData, style }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const opacity = useRef(new Animated.Value(0)).current;
  const nextOpacity = useRef(new Animated.Value(0)).current;
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [nextImageUrl, setNextImageUrl] = useState('');

  // Get screen dimensions
  const { width: screenWidth } = Dimensions.get('window');

  // Calculate scaling
  const getScaledDimensions = () => {
    if (!animationData?.metadata) return { width: 0, height: 0 };

    const { width, height } = animationData.metadata;
    const containerWidth = style?.width || screenWidth * 0.6; // Default to 60% of screen width
    const scale = containerWidth / width;

    return {
      width: containerWidth,
      height: height * scale
    };
  };

  useEffect(() => {
    if (!animationData || !animationData.frames || !animationData.metadata) {
      console.error('Invalid animation data');
      return;
    }

    const frameInterval = 1000 / animationData.metadata.fps;
    let frameTimer;

    const updateFrame = () => {
      setCurrentFrame(prev => {
        const nextFrame = (prev + 1) % animationData.frames.length;

        setCurrentImageUrl(`data:image/jpeg;base64,${animationData.frames[prev].data}`);
        setNextImageUrl(`data:image/jpeg;base64,${animationData.frames[nextFrame].data}`);

        Animated.sequence([
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0,
              duration: frameInterval / 2,
              useNativeDriver: true,
            }),
            Animated.timing(nextOpacity, {
              toValue: 1,
              duration: frameInterval / 2,
              useNativeDriver: true,
            })
          ])
        ]).start();

        return nextFrame;
      });
    };

    frameTimer = setInterval(updateFrame, frameInterval);
    return () => clearInterval(frameTimer);
  }, [animationData]);

  if (!animationData || !animationData.frames || !animationData.metadata) {
    return null;
  }

  const dimensions = getScaledDimensions();

  return (
    <View style={[styles.container, style, dimensions]}>
      <Animated.Image
        source={{ uri: currentImageUrl }}
        style={[
          styles.frame,
          dimensions,
          { opacity: opacity }
        ]}
        resizeMode="contain"
      />
      <Animated.Image
        source={{ uri: nextImageUrl }}
        style={[
          styles.frame,
          dimensions,
          { opacity: nextOpacity }
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  frame: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default JSONAnimationPlayer;
