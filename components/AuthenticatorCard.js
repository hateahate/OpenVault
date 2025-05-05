import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Pressable, Text } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { generateTOTP } from '../utils/crypto/totpGenerator';
import { AuthenticatorCardStyles as styles } from '../styles/AuthenticatorCardStyles';

export default function AuthenticatorCard({ item, index, onLongPress, onPress, currentTime }) {
    const progress = useRef(new Animated.Value(1)).current;
    const animationRef = useRef(null);

    const period = item.period || 30;
    const secondsPassed = Math.floor(currentTime / 1000) % period;
    const secondsLeft = period - secondsPassed;
    const counter = Math.floor(currentTime / 1000 / period);

    const code = generateTOTP(item.secret, period, item.digits || 6);
    const codeFormatted = code.match(/.{1,3}/g)?.join(' ') || code;

    const startProgressAnimation = () => {
        if (animationRef.current) {
            animationRef.current.stop();
        }
        progress.setValue(secondsLeft / period);
        animationRef.current = Animated.timing(progress, {
            toValue: 0,
            duration: secondsLeft * 1000,
            useNativeDriver: false,
        });
        animationRef.current.start();
    };

    useEffect(() => {
        startProgressAnimation();
    }, [counter]);

    return (
        <Pressable onLongPress={() => onLongPress(index)} onPress={() => onPress(index)}>
            <Card style={styles.card}>
                <Animated.View style={[styles.progressBar, {
                    width: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                    }),
                }]} />
                <Card.Content style={styles.cardContent}>
                    <Text variant="titleLarge" style={styles.serviceName}>{item.label}</Text>
                    <Text style={styles.code}>{codeFormatted}</Text>
                    <Text style={styles.timer}>{secondsLeft}s</Text>
                </Card.Content>
            </Card>
        </Pressable>
    );
}
