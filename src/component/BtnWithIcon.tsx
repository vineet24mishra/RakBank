import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, GestureResponderEvent } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../utils/Colors';

// Define the prop types for the button component
interface ConditionalButtonProps {
    title: string;
    condition: boolean;
    onPress: (event: GestureResponderEvent) => void;
}

const ConditionalButton: React.FC<ConditionalButtonProps> = ({ title, condition, onPress }) => {
    // Choose the icon based on the condition
    const iconName = !condition ? 'check-circle' : 'cancel'; // You can replace these with any icons you want

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <View style={styles.iconAndText}>
                <Icon name={iconName} size={24} color={Colors.BtnTitleColor} style={styles.icon} />
                <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.BtnBgColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    iconAndText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    title: {
        color: Colors.BtnTitleColor,
        fontSize: 16,
        fontWeight: 'bold'
    },
});

export default ConditionalButton;
