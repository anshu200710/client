import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Custom Add Button Component for the center tab
const AddButton = ({ onPress }: { onPress?: () => void }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            top: -20,
            justifyContent: 'center',
            alignItems: 'center',
        }}
        activeOpacity={0.9}
    >
        <View
            style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#0066CC',
                justifyContent: 'center', // Centers the icon inside the circle
                alignItems: 'center',
                boxShadow: '0 4px 8px rgba(0, 102, 204, 0.4)',
                elevation: 5,
            }}
        >
            <Ionicons name="add" size={32} color="#fff" />
        </View>
    </TouchableOpacity>
);

export default function DashboardLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#0066CC',
                tabBarInactiveTintColor: '#94A3B8',
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 10,
                    backgroundColor: '#ffffff',
                    borderTopColor: '#f1f5f9',
                    borderTopWidth: 1,
                    height: Platform.OS === 'ios' ? 85 : 70, // Adjust height for safe area
                    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
                    paddingTop: 8,
                    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '500',
                    marginTop: 4,
                }
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Hub',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="services"
                options={{
                    title: 'Services',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="briefcase" size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="action"
                options={{
                    title: '', // Empty title for center button
                    tabBarIcon: () => null, // Icon is now hardcoded in AddButton
                    tabBarButton: (props: any) => (
                        <View style={{ width: '20%', alignItems: 'center' }}>
                            <AddButton onPress={props.onPress} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles" size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={22} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
