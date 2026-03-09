import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

type DocItem = {
    id: string;
    name: string;
    size: string;
};

const initialDocs: DocItem[] = [
    { id: '1', name: 'pan_card.pdf', size: '2.4 MB' },
    { id: '2', name: 'shop_photo.jpg', size: '4.1 MB' },
];

const statusSteps = [
    {
        title: 'Submitted',
        sub: 'Your request has been received by our team.',
        time: '24 Oct, 10:30 AM',
        state: 'done',
    },
    {
        title: 'Reviewing Documents',
        sub: 'Admin is currently verifying your attached documents.',
        time: 'In Progress',
        state: 'active',
    },
    {
        title: 'Processing Application',
        sub: 'Filing with government portal.',
        time: '',
        state: 'todo',
    },
    {
        title: 'Completed',
        sub: 'GST Number generated and sent.',
        time: '',
        state: 'todo',
    },
] as const;

export default function RequestDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ service?: string; requestId?: string }>();

    const [docs, setDocs] = useState<DocItem[]>(initialDocs);
    const [newDocName, setNewDocName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState('');

    const serviceName = params.service ?? 'GST Registration';
    const requestId = params.requestId ?? '#VS-9921';

    const canAdd = useMemo(() => newDocName.trim().length > 2, [newDocName]);

    const addDocument = () => {
        if (!canAdd) {
            return;
        }
        const newItem: DocItem = {
            id: Date.now().toString(),
            name: newDocName.trim(),
            size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
        };
        setDocs((prev) => [newItem, ...prev]);
        setNewDocName('');
    };

    const deleteDocument = (id: string) => {
        setDocs((prev) => prev.filter((doc) => doc.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setEditingValue('');
        }
    };

    const startEditing = (doc: DocItem) => {
        setEditingId(doc.id);
        setEditingValue(doc.name);
    };

    const saveEdit = () => {
        if (!editingId || editingValue.trim().length < 3) {
            return;
        }
        setDocs((prev) => prev.map((doc) => (doc.id === editingId ? { ...doc, name: editingValue.trim() } : doc)));
        setEditingId(null);
        setEditingValue('');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F4F7FB]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-5 pt-2 pb-4 flex-row items-center">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-white items-center justify-center border border-[#E5EAF0]"
                >
                    <Ionicons name="chevron-back" size={20} color="#0F172A" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-[#0F172A] ml-3">Request Details</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                <View className="bg-white rounded-2xl border border-[#E5EAF0] p-4 mb-4">
                    <View className="flex-row items-start justify-between">
                        <View>
                            <View className="bg-[#EAF2FF] px-2 py-1 rounded-full self-start">
                                <Text className="text-[10px] text-[#2563EB] font-semibold">Service Request</Text>
                            </View>
                            <Text className="text-[24px] font-bold text-[#0F172A] mt-2">{serviceName}</Text>
                            <Text className="text-xs text-[#64748B] mt-1">Req ID: {requestId}</Text>
                        </View>
                        <View className="w-10 h-10 rounded-lg bg-[#EAF2FF] items-center justify-center">
                            <Ionicons name="document-text" size={18} color="#2563EB" />
                        </View>
                    </View>

                    <View className="h-[1px] bg-[#EEF2F7] my-3" />
                    <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={14} color="#64748B" />
                        <Text className="text-xs text-[#64748B] ml-2">Submitted on 24 Oct, 2023</Text>
                    </View>
                </View>

                <View className="bg-white rounded-2xl border border-[#E5EAF0] p-4 mb-4">
                    <Text className="text-[15px] font-bold text-[#0F172A] mb-3">Request Status</Text>
                    {statusSteps.map((step, index) => {
                        const isDone = step.state === 'done';
                        const isActive = step.state === 'active';
                        return (
                            <View key={step.title} className="flex-row">
                                <View className="items-center mr-3">
                                    <View className={`w-5 h-5 rounded-full items-center justify-center ${isDone ? 'bg-[#2A83E8]' : isActive ? 'bg-[#93C5FD]' : 'bg-[#E2E8F0]'}`}>
                                        {isDone ? <Ionicons name="checkmark" size={12} color="#fff" /> : <View className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#1D4ED8]' : 'bg-[#CBD5E1]'}`} />}
                                    </View>
                                    {index !== statusSteps.length - 1 && <View className="w-[2px] h-9 bg-[#E2E8F0]" />}
                                </View>

                                <View className="flex-1 pb-3">
                                    <Text className={`text-sm font-semibold ${isDone || isActive ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>{step.title}</Text>
                                    <Text className={`text-xs mt-0.5 ${isDone || isActive ? 'text-[#64748B]' : 'text-[#CBD5E1]'}`}>{step.sub}</Text>
                                    {!!step.time && <Text className="text-[10px] text-[#94A3B8] mt-1">{step.time}</Text>}
                                </View>
                            </View>
                        );
                    })}
                </View>

                <Text className="text-[15px] font-bold text-[#0F172A] mb-2">Uploaded Documents</Text>
                <View className="bg-white rounded-2xl border border-[#E5EAF0] p-3 mb-3">
                    <Text className="text-xs text-[#94A3B8] font-semibold mb-2">ADD DOCUMENT</Text>
                    <View className="flex-row items-center">
                        <TextInput
                            value={newDocName}
                            onChangeText={setNewDocName}
                            placeholder="example: gst_certificate.pdf"
                            placeholderTextColor="#94A3B8"
                            className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-sm text-[#0F172A]"
                        />
                        <TouchableOpacity
                            onPress={addDocument}
                            disabled={!canAdd}
                            className={`ml-2 px-3 py-2.5 rounded-xl ${canAdd ? 'bg-[#0066CC]' : 'bg-[#93C5FD]'}`}
                        >
                            <Text className="text-xs text-white font-semibold">Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {docs.map((doc) => (
                    <View key={doc.id} className="bg-white rounded-2xl border border-[#E5EAF0] p-3 mb-2.5">
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 rounded-lg bg-[#FEE2E2] items-center justify-center mr-2">
                                <Ionicons name="document-attach" size={14} color="#EF4444" />
                            </View>

                            <View className="flex-1">
                                {editingId === doc.id ? (
                                    <TextInput
                                        value={editingValue}
                                        onChangeText={setEditingValue}
                                        className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2 py-1.5 text-sm text-[#0F172A]"
                                    />
                                ) : (
                                    <Text className="text-sm font-semibold text-[#0F172A]">{doc.name}</Text>
                                )}
                                <Text className="text-[11px] text-[#94A3B8] mt-0.5">{doc.size}</Text>
                            </View>

                            <View className="flex-row items-center">
                                <TouchableOpacity className="px-2 py-1" onPress={() => startEditing(doc)}>
                                    <Ionicons name="create-outline" size={16} color="#2563EB" />
                                </TouchableOpacity>
                                {editingId === doc.id ? (
                                    <TouchableOpacity className="px-2 py-1" onPress={saveEdit}>
                                        <Ionicons name="checkmark-done" size={16} color="#16A34A" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity className="px-2 py-1">
                                        <Ionicons name="eye" size={16} color="#2563EB" />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity className="px-2 py-1" onPress={() => deleteDocument(doc.id)}>
                                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}

                <View className="bg-[#FFF7DF] border border-[#F4D35E] rounded-2xl p-3.5 mt-2 mb-4">
                    <View className="flex-row items-center mb-1.5">
                        <Ionicons name="alert-circle" size={14} color="#B45309" />
                        <Text className="text-sm font-semibold text-[#B45309] ml-1">Admin Note</Text>
                    </View>
                    <Text className="text-xs text-[#92400E] leading-5">
                        Namaste! Please re-upload a clearer picture of your shop establishment license. The current one is blurry and the registration number is not visible.
                    </Text>
                    <TouchableOpacity className="mt-2" onPress={() => setNewDocName('shop_license_clear.jpg')}>
                        <Text className="text-xs font-semibold text-[#1D4ED8]">Re-upload Document</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className="bg-white border border-[#D7E0EA] rounded-xl py-3.5 items-center flex-row justify-center"
                    onPress={() => router.push('/(dashboard)/profile-pages/admin-chat')}
                >
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color="#0F172A" />
                    <Text className="text-sm font-semibold text-[#0F172A] ml-2">Contact Support / Chat with Admin</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
