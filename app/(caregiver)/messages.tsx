import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Bell, MessageSquare, Send } from "lucide-react-native";
import { useLanguage } from "@/context/LanguageContext";
import { mockMessages } from "@/mocks/messages";
import { Message } from "@/types/child";
import colors from "@/constants/colors";

export default function MessagesScreen() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "reminders" | "chat">("all");

  const filteredMessages = messages.filter((message) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "reminders") return message.type === "reminder" || message.type === "notification";
    if (selectedTab === "chat") return message.type === "text";
    return true;
  });

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: `m${messages.length + 1}`,
      senderId: "c1",
      receiverId: "h1",
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
      type: "text",
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isUserMessage = item.senderId === "c1";
    const isSystemMessage = item.senderId === "system";
    
    if (isSystemMessage) {
      return (
        <View style={styles.systemMessageContainer}>
          <View style={styles.systemMessage}>
            <Bell size={16} color={colors.primary} style={styles.systemIcon} />
            <Text style={styles.systemMessageText}>{item.content}</Text>
          </View>
          <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
        </View>
      );
    }
    
    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage ? styles.userMessageContainer : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUserMessage ? styles.userMessageBubble : styles.otherMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUserMessage ? styles.userMessageText : styles.otherMessageText,
            ]}
          >
            {item.content}
          </Text>
        </View>
        <Text
          style={[
            styles.messageTime,
            isUserMessage ? styles.userMessageTime : styles.otherMessageTime,
          ]}
        >
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <Pressable
          style={[
            styles.tab,
            selectedTab === "all" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("all")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "all" && styles.activeTabText,
            ]}
          >
            All
          </Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.tab,
            selectedTab === "reminders" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("reminders")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "reminders" && styles.activeTabText,
            ]}
          >
            Reminders
          </Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.tab,
            selectedTab === "chat" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("chat")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "chat" && styles.activeTabText,
            ]}
          >
            Chat
          </Text>
        </Pressable>
      </View>
      
      <FlatList
        data={filteredMessages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />
      
      {selectedTab === "chat" && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor={colors.placeholder}
            multiline
          />
          <Pressable
            style={[
              styles.sendButton,
              !newMessage.trim() && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Send
              size={20}
              color={newMessage.trim() ? colors.card : colors.placeholder}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: "600" as const,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.card,
  },
  otherMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  userMessageTime: {
    color: colors.textLight,
    alignSelf: "flex-end",
  },
  otherMessageTime: {
    color: colors.textLight,
  },
  systemMessageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  systemMessage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: "90%",
  },
  systemIcon: {
    marginRight: 8,
  },
  systemMessageText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
});