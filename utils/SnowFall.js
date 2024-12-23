export const SnowfallEffect = () => (
  <LottieView
    source={require('../assets/snowfall-animation.json')}
    autoPlay
    loop
    style={styles.backgroundAnimation}
    pointerEvents="none"
  />
);
