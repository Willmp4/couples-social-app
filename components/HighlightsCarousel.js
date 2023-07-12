import React, { forwardRef } from "react";
import { ScrollView, Dimensions, View } from 'react-native'
import Highlight from "./Highlight"
import styles from "../styles/Home.styles";
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';


const { width } = Dimensions.get("window")

const HighlightsCarousel = forwardRef(({ highlights, onScrollBeginDrag, onScrollEndDrag, onMomentumScrollEnd, onLongPress }, ref) => {
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
                <LongPressGestureHandler
                    key={post.id}  // assign unique key here
                    onHandlerStateChange={({nativeEvent}) => {
                        if(nativeEvent.state === State.ACTIVE) {
                            onLongPress(post.id);
                        }
                    }}
                    minDurationMs={800}
                >
                    <View style={styles.slide}>
                        <Highlight post={post}/>
                    </View>
                </LongPressGestureHandler>
            ))}
        </ScrollView>
    );
})



export default HighlightsCarousel;
