import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet, Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import JSONAnimationPlayer from '../../utils/JSONAnimationPlayer';

const { width, height } = Dimensions.get('window');

const ChristmasSurprise = () => {
  const [isQuizVisible, setIsQuizVisible] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const slideAnimation = useRef(new Animated.Value(height)).current;
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  const questions = [{
    question: "What were you wearing when we first kissed?",
    answer: "Green Rompa",
    options: ["Onesie", "Black Dress", "Green Rompa", "Nothing;)"]
  }];

  const handlePresentPress = () => {
    setIsQuizVisible(true);
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.spring(slideAnimation, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7
        }),
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true
        }),
        Animated.spring(scaleAnimation, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7
        })
      ]).start();
    });
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: height,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnimation, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      setIsQuizVisible(false);
      setHasWon(false);
    });
  };

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === questions[0].answer) {
      setHasWon(true);
    } else {
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true
        })
      ]).start();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.decorativeBorder} />

      <View style={styles.mainContent}>
        <View style={styles.featureBox}>
          <Text style={styles.snowflake}>❄️</Text>
          <Text style={styles.snowflake}>❄️</Text>
          <Text style={styles.snowflake}>❄️</Text>
        </View>

        <View style={styles.presentContainer}>
          <TouchableOpacity
            onPress={handlePresentPress}
            style={styles.presentButton}
            disabled={isQuizVisible}
          >
            <LottieView
              source={require('../../assets/christmas-present.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
            <Text style={styles.presentText}>
              🎄 Tap to unwrap your Christmas surprise! 🎄
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featureBox}>
          <Text style={styles.decorationText}>🎅</Text>
          <Text style={styles.decorationText}>⭐</Text>
          <Text style={styles.decorationText}>🤶</Text>
        </View>
      </View>

      <Modal
        visible={isQuizVisible}
        transparent={true}
        animationType="none"
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContainer, {
            transform: [
              { translateY: slideAnimation },
              { scale: scaleAnimation }
            ],
            opacity: opacityAnimation,
          }]}>
            <View style={styles.modalContent}>
              {!hasWon ? (
                <Animated.View style={[styles.quizContainer, {
                  transform: [{ translateX: shakeAnimation }]
                }]}>
                  <View style={styles.questionCard}>
                    <Text style={styles.questionText}>{questions[0].question}</Text>
                  </View>
                  <View style={styles.optionsContainer}>
                    {questions[0].options.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleAnswer(option)}
                        style={styles.optionButton}
                      >
                        <Text style={styles.optionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </Animated.View>
              ) : (
                <View style={styles.winContainer}>
                  <View style={styles.starContainer}>
                    <JSONAnimationPlayer
                      animationData={require('../../assets/hamilton-stars.json')}
                      style={styles.hamiltonAnimation}
                    />
                  </View>
                  <Text style={styles.congratsText}>
                    🎭 You're going to Hamilton! 🎭
                  </Text>
                  <Text style={styles.messageText}>
                    Merry Christmas! {'\n'}
                    I can't wait to share this incredible show with you! ❤️
                  </Text>
                  <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>

      <View style={styles.decorativeBorder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#082c1b',
    borderRadius: 20,
    overflow: 'hidden',
  },
  decorativeBorder: {
    width: '100%',
    height: 16,
    backgroundColor: '#fecdd3',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 32,
  },
  featureBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 12,
  },
  presentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 32,
    padding: 28,
    alignItems: 'center',
    width: '90%',
    borderWidth: 1,
    borderColor: '#fecdd3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  presentButton: {
    alignItems: 'center',
    width: '100%',
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  presentText: {
    color: '#f0f9ff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 0.5,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 15,
  },
  snowflake: {
    fontSize: 24,
    color: '#e0f7fa',
    opacity: 0.9,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  decorationText: {
    fontSize: 28,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    backgroundColor: '#0c2f1f',
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 999,
    borderWidth: 1,
    borderColor: '#fecdd3',
    overflow: 'hidden',
  },
  modalContent: {
    padding: 24,
  },
  quizContainer: {
    minHeight: height * 0.5,
    justifyContent: 'space-between',
  },
  questionCard: {
    backgroundColor: '#15803d',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fecdd3',
    textAlign: 'center',
    lineHeight: 32,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  optionButton: {
    backgroundColor: '#fecdd3',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginHorizontal: 16,
    borderColor: '#fecdd3',
  },
  optionText: {
    color: '#064e3b',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  winContainer: {
    alignItems: 'center',
    gap: 24,
    paddingVertical: 20,
  },
  starContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  hamiltonAnimation: {
    width: 150,
    alignSelf: 'center',
  },
  congratsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fecdd3',
    textAlign: 'center',
    lineHeight: 36,
  },
  messageText: {
    fontSize: 18,
    color: '#f0f9ff',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#15803d',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#15803d',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ChristmasSurprise;
