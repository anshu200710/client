import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

type ChatMessage = {
    id: string;
    from: 'user' | 'admin';
    text: string;
    time: string;
};

const initialMessages: ChatMessage[] = [
    {
        id: '1',
        from: 'admin',
        text: 'Hello Rajesh, please re-upload a clear shop photo so we can proceed quickly.',
        time: '10:02 AM',
    },
    {
        id: '2',
        from: 'user',
        text: 'Sure, I will upload it today. Please check once done.',
        time: '10:05 AM',
    },
    {
        id: '3',
        from: 'admin',
        text: 'Great. Once uploaded, your status will move to Processing.',
        time: '10:07 AM',
    },
];

export default function AdminChatScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isAdminTyping, setIsAdminTyping] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

    const quickReplies = ['Document uploaded', 'Please verify now', 'Need help with payment'];

    const adminAutoReply = (userText: string) => {
        setIsAdminTyping(true);
        const lower = userText.toLowerCase();

        setTimeout(() => {
            let reply = 'Thanks for the update. I have forwarded this to the verification team.';

            if (lower.includes('uploaded') || lower.includes('document')) {
                reply = 'Received. I can see your document update. Verification should complete within 24 hours.';
            } else if (lower.includes('payment')) {
                reply = 'Payment status looks pending from bank gateway. Please wait 5-10 minutes and refresh.';
            } else if (lower.includes('help')) {
                reply = 'Sure, please share the exact issue and I will guide you step by step.';
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: `admin-${Date.now()}`,
                    from: 'admin',
                    text: reply,
                    time: 'Now',
                },
            ]);
            setIsAdminTyping(false);
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
        }, 1000);
    };

    const sendMessage = () => {
        const trimmed = input.trim();
        if (trimmed.length < 1) {
            return;
        }

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            from: 'user',
            text: trimmed,
            time: 'Now',
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput('');
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
        adminAutoReply(trimmed);
    };

    const sendQuickReply = (text: string) => {
        setInput(text);
        setTimeout(() => {
            setInput(text);
            const newMessage: ChatMessage = {
                id: Date.now().toString(),
                from: 'user',
                text,
                time: 'Now',
            };
            setMessages((prev) => [...prev, newMessage]);
            setInput('');
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
            adminAutoReply(text);
        }, 10);
    };

    const sendAttachmentNotice = () => {
        const text = 'I have uploaded the requested document. Please review.';
        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            from: 'user',
            text,
            time: 'Now',
        };
        setMessages((prev) => [...prev, newMessage]);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
        adminAutoReply(text);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F4F7FB]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-5 pt-2 pb-3 flex-row items-center justify-between border-b border-[#E5EAF0] bg-white">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-white items-center justify-center border border-[#E5EAF0]"
                    >
                        <Ionicons name="chevron-back" size={20} color="#0F172A" />
                    </TouchableOpacity>
                    <View className="ml-3">
                        <Text className="text-lg font-bold text-[#0F172A]">Admin Chat</Text>
                        <Text className="text-xs text-[#16A34A]">Online</Text>
                    </View>
                </View>
                <View className="w-9 h-9 rounded-full bg-[#E8F8FE] items-center justify-center">
                    <Ionicons name="shield-checkmark" size={18} color="#0284C7" />
                </View>
            </View>

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
            >
                <ScrollView
                    ref={scrollRef}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.map((message) => {
                        const fromUser = message.from === 'user';
                        return (
                            <View key={message.id} className={`mb-3 ${fromUser ? 'items-end' : 'items-start'}`}>
                                <View className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] ${fromUser ? 'bg-[#0066CC]' : 'bg-white border border-[#E2E8F0]'}`}>
                                    <Text className={`text-sm ${fromUser ? 'text-white' : 'text-[#0F172A]'}`}>{message.text}</Text>
                                </View>
                                <Text className="text-[10px] text-[#94A3B8] mt-1">{message.time}</Text>
                            </View>
                        );
                    })}

                    {isAdminTyping && (
                        <View className="mb-3 items-start">
                            <View className="rounded-2xl px-3.5 py-2.5 bg-white border border-[#E2E8F0]">
                                <Text className="text-xs text-[#64748B]">Admin is typing...</Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                <View
                    className="px-4 pt-2 bg-white border-t border-[#E5EAF0]"
                    style={{ paddingBottom: Math.max(insets.bottom, 10) + 72 }}
                >
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                        {quickReplies.map((reply) => (
                            <TouchableOpacity
                                key={reply}
                                onPress={() => sendQuickReply(reply)}
                                className="bg-[#EFF6FF] border border-[#DBEAFE] px-3 py-1.5 rounded-full mr-2"
                            >
                                <Text className="text-[11px] font-semibold text-[#1D4ED8]">{reply}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity onPress={sendAttachmentNotice} className="mr-2 bg-[#EFF6FF] w-11 h-11 rounded-xl items-center justify-center">
                            <Ionicons name="attach" size={16} color="#1D4ED8" />
                        </TouchableOpacity>

                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder="Type your message..."
                            placeholderTextColor="#94A3B8"
                            onSubmitEditing={sendMessage}
                            returnKeyType="send"
                            className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-sm text-[#0F172A]"
                        />

                        <TouchableOpacity
                            onPress={sendMessage}
                            disabled={input.trim().length === 0}
                            className={`ml-2 w-11 h-11 rounded-xl items-center justify-center ${input.trim().length === 0 ? 'bg-[#93C5FD]' : 'bg-[#0066CC]'}`}
                        >
                            <Ionicons name="send" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
