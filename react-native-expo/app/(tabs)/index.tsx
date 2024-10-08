import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { magic } from '../../config/magic';

export default function Index() {

	return (
		<View style={styles.container}>
			<Text>Total Balance</Text>
			<Text>$100.00</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		color: "#fff",
	},
	button: {
		fontSize: 20,
		textDecorationLine: "underline",
		color: "#fff",
		borderRadius: 5,
	},
	title: {
		fontSize: 24,
		marginBottom: 20,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ddd',
		width: "80%",
		padding: 10,
		marginBottom: 20,
	},
});
