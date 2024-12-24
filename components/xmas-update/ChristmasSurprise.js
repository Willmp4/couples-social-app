import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet, Modal, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import JSONAnimationPlayer from '../../utils/JSONAnimationPlayer';

const { width, height } = Dimensions.get('window');

const ChristmasSurprise = () => {
  // State management
  const [isQuizVisible, setIsQuizVisible] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [tooEarlyModalVisible, setTooEarlyModalVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [timeUntilChristmas, setTimeUntilChristmas] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Animations
  const [shakeAnimation] = useState(new Animated.Value(0));
  const slideAnimation = useRef(new Animated.Value(height)).current;
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const bounceAnimation = useRef(new Animated.Value(1)).current;

  const questions = [
    {
      question: "What were you wearing when we first kissed?",
      answer: "Green Rompa",
      options: ["Onesie", "Black Dress", "Green Rompa", "Nothing;)"]
    },
    {
      question: "Where is the first place we went on hoilday together?",
      answer: "Majorca",
      options: ["Poland", "New York", "Majorca", "Ibiza"]
    },
    {
      question: "Where was our second date?",
      answer: "A Fancy Restaurant",
      options: ["The Movies", "The Beach", "A Fancy Restaurant", "The Park"]
    },
    {
      question: "Which musical have we seen together?",
      answer: "Starlight Express",
      options: ["Starlight Express", "Sound of Music", "Lion King", "Phantom of the Opera"]
    },
    {
      question: "Which of these is our song?",
      answer: "I Love You",
      options: ["All of Me", "I Love You", "Just the Way You Are", "At Last"]
    }
  ];

  const messages = {
    tooEarly: [
      "Ho ho hold your horses! 🎅 Santa hasn't cleared you for present opening yet!",
      "Nice try, you sneaky elf! 🧝‍♂️ Come back on Christmas Day!",
      "Sorry, this present is still charging... Check back on Dec 25th! ⚡🎁",
      "Error 25/12: Present not found. Please try again on Christmas Day! 🎄",
      "Looks like someone's on the 'Too Early' list! 📝 See you on Christmas!",
      "Present loading... ETA: December 25th 🔄",
      "Santa's still wrapping this one! 🎁",
    ],
    almostThere: [
      "Almost there! Just a few more sleeps! 😴",
      "The elves are putting on the finishing touches! ✨",
      "Santa's GPS is locked on your location! 🎅📍",
      "Ho ho hold your horses! 🎅 Santa hasn't cleared you for present opening yet!",
      "Nice try, you sneaky elf! 🧝‍♂️ Come back on Christmas Day!",
      "Nice try Shoonks but its not time yet! 🎅",
      "Looks like someone's on the 'Too Early' list! 📝 See you on Christmas!",
      "Santa's still wrapping this one! 🎁",
    ],
    dayBefore: [
      "Tomorrow's the big day! Can you wait just ONE more day? 🎄",
      "Santa's sleigh is being loaded! Check back tomorrow bubba! 🛷",
      "24 hours to go! The anticipation is killing me too! ⏰",
    ]
  };

  const getChristmasStatus = () => {
    const now = new Date(2024, 11, 25);
    const christmas = new Date(now.getFullYear(), 11, 25);

    if (now > christmas) {
      christmas.setFullYear(christmas.getFullYear() + 1);
    }

    const timeDiff = christmas - now;
    const daysUntilChristmas = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return {
      isChristmas: now.getMonth() === 11 && now.getDate() === 25,
      daysRemaining: daysUntilChristmas,
      isAlmostChristmas: daysUntilChristmas <= 7,
      isDayBefore: daysUntilChristmas === 1
    };
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const status = getChristmasStatus();
      const { daysRemaining } = status;

      setTimeUntilChristmas(
        daysRemaining === 1
          ? "1 day"
          : `${daysRemaining} days`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Bounce animation
  useEffect(() => {
    const bounceSequence = Animated.sequence([
      Animated.timing(bounceAnimation, {
        toValue: 1.051,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]);

    Animated.loop(bounceSequence).start();
  }, []);

  const getMessage = () => {
    const status = getChristmasStatus();
    let messageArray;

    if (status.isDayBefore) {
      messageArray = messages.dayBefore;
    } else if (status.isAlmostChristmas) {
      messageArray = messages.almostThere;
    } else {
      messageArray = messages.tooEarly;
    }

    return messageArray[Math.floor(Math.random() * messageArray.length)];
  };

  const handlePresentPress = () => {
    const status = getChristmasStatus();

    if (!status.isChristmas) {
      const message = getMessage();
      setCurrentMessage(message);
      setTooEarlyModalVisible(true);

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

      return;
    }

    setIsQuizVisible(true);
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
  };

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === questions[currentQuestionIndex].answer) {
      if (currentQuestionIndex === questions.length - 1) {
        setHasWon(true);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
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
      setCurrentQuestionIndex(0);
    });
  };

  const renderCountdown = () => {
    const status = getChristmasStatus();
    if (status.isChristmas) {
      return <Text style={styles.countdownText}>It's Christmas! 🎄</Text>;
    }
    return (
      <Text style={styles.countdownText}>
        {`Christmas in ${timeUntilChristmas}! 🎄`}
      </Text>
    );
  };

  const renderQuizProgress = () => {
    return (
      <View style={styles.progressContainer}>
        {questions.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === currentQuestionIndex ? styles.progressDotActive : null,
              index < currentQuestionIndex ? styles.progressDotCompleted : null
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.decorativeBorder} />

      <View style={styles.mainContent}>
        <View style={styles.featureBox}>
          {renderCountdown()}
        </View>

        <Animated.View style={[
          styles.presentContainer,
          {
            transform: [
              { scale: bounceAnimation },
              { translateX: shakeAnimation }
            ]
          }
        ]}>
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
        </Animated.View>

        <View style={styles.featureBox}>
          <Text style={styles.decorationText}>🎅</Text>
          <Text style={styles.decorationText}>⭐</Text>
          <Text style={styles.decorationText}>🤶</Text>
        </View>
      </View>

      {/* Too Early Modal */}
      <Modal
        visible={tooEarlyModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[
            styles.tooEarlyModalContainer,
            {
              transform: [{ scale: scaleAnimation }]
            }
          ]}>
            <Text style={styles.tooEarlyEmoji}>🎅</Text>
            <Text style={styles.tooEarlyText}>{currentMessage}</Text>
            <Text style={styles.countdownSubtext}>
              {timeUntilChristmas} until Christmas!
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setTooEarlyModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Ok, I'll be patient!</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Quiz Modal */}
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
                  {renderQuizProgress()}
                  <View style={styles.questionCard}>
                    <Text style={styles.questionText}>
                      {questions[currentQuestionIndex].question}
                    </Text>
                  </View>
                  <View style={styles.optionsContainer}>
                    {questions[currentQuestionIndex].options.map((option, index) => (
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
                    🎭 We are going see see Hamilton at the end of August my love! 🎭
                  </Text>
                  <Text style={styles.messageText}>
                    Merry Christmas! {'\n'}
                    I can't wait to see this incredible show with you bubba! ❤️
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
  tooEarlyModalContainer: {
    backgroundColor: '#0c2f1f',
    borderRadius: 24,
    padding: 24,
    width: width * 0.85,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fecdd3',
  },
  tooEarlyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  tooEarlyText: {
    fontSize: 20,
    color: '#f0f9ff',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 28,
    fontWeight: '600',
  },
});

export default ChristmasSurprise;
