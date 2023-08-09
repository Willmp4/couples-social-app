import React from "react";
import {View, Text, StyleSheet} from "react-native";


export default function CardComponent({title, content, date}){
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.content}>{content}</Text>
            {date && <Text style={styles.date}>{date}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        borderColor: "#ddd",
        padding: 15,
        margin: 10,
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    content: {
        marginTop: 10,
    },
    date: {
        marginTop: 10,
        fontSize: 12,
        color: '#888'
    },
})