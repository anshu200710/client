import React from 'react';
import { Stack } from 'expo-router';

export default function ServicePagesLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#F4F7FB' },
            }}
        />
    );
}
