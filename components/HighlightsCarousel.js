import React, { forwardRef } from "react";
import { ScrollView, Dimensions, View } from 'react-native'
import Highlight from "./Highlight"
import styles from "../styles/Home.styles";
const { width } = Dimensions.get("window")

const HighlightsCarousel = forwardRef(({ highlights, onScrollBeginDrag, onScrollEndDrag, onMomentumScrollEnd }, ref) => {
    return (
        <ScrollView
            ref={ref}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={width}
            decelerationRate="fast"
            onScrollBeginDrag={onScrollBeginDrag}
            onScrollEndDrag={onScrollEndDrag}
            onMomentumScrollEnd={onMomentumScrollEnd}
        >
            {highlights.map((post, index)=>(
                <View key={post.id} style={styles.slide}>
                    <Highlight post={post}/>
                </View>
            ))}
        </ScrollView>
    );
})

export default HighlightsCarousel;
