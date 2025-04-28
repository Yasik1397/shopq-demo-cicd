import PropTypes from "prop-types";
import React from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useNotificationApiMutation } from "../../../Api/EndPoints/notification";
import { useNotification_ApiQuery } from "../../../Api/EndPoints/user_profile";

import PrimaryHeader from "../../../components/Header";

import { DefaultImage } from "../../../constants/IMAGES";
import { COLORS, FONTS } from "../../../constants/Theme";

import { capitalizeFirstLetter } from "../../../utils/TextFormat";
import { RFValue } from "../../../utils/responsive";

const Notification = ({ navigation }) => {
  const user = useSelector((state) => state?.Userdata?.user?.records);
  const [notificationApi] = useNotificationApiMutation();

  const { data, refetch: notification_refetch } = useNotification_ApiQuery({
    id: user?.id,
  });
  const ValidData =
    data && typeof data === "object" ? Object?.values(data).flat() : null;
  const NotificationData = ValidData?.filter(
    (item) => typeof item === "object"
  );

  const timeAgo = (timestamp) => {
    const createdAt = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - createdAt) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60)
      return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hr${diffInHours > 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    return createdAt.toLocaleDateString();
  };
  const handlePress = (item) => {
    notificationApi({
      userid: user?.id,
      notificationid: item?.id,
    }).then((res) => {
      if (res?.data?.success) {
        navigation.navigate("OrderinfoScreen", {
          order_id: item?.notification,
        });
      }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <PrimaryHeader
        onPress={() => navigation.goBack()}
        headerName={"Notifications"}
      />
      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: COLORS.WHITE,
          paddingHorizontal: 16,
        }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={notification_refetch} />
        }
        ItemSeparatorComponent={() => (
          <View
            style={{ height: 2, backgroundColor: "#F5F5F6", marginVertical: 8 }}
          />
        )}
        showsVerticalScrollIndicator={false}
        data={NotificationData || []}
        renderItem={({ item, index }) => {
          return (
            <Animated.View
              key={index + 1}
              entering={FadeInDown.delay((index + 1) * 50)}
            >
              <Pressable
                key={item?.id}
                style={{
                  backgroundColor: item?.is_read ? "#FFFFFF" : "#F9FAFF",
                  borderRadius: 8,
                  flexDirection: "row",
                  padding: 8,
                }}
                onPress={() => handlePress(item)}
              >
                <View style={{ flex: 1, marginHorizontal: 10 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: FONTS.MEDIUM,
                        fontSize: RFValue(14),
                        color: "#061018",
                      }}
                    >
                      {capitalizeFirstLetter(item?.title)}
                    </Text>
                    {item?.is_read ? null : (
                      <View
                        style={{
                          backgroundColor: "#2B38AC",
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                        }}
                      />
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "center",
                      paddingVertical: 4,
                    }}
                  >
                    <FastImage
                      source={{
                        uri: item?.image_url
                          ? item?.image_url
                          : DefaultImage.products,
                      }}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 4,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />

                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: FONTS.REGULAR,
                          fontSize: RFValue(12),
                          color: "#8B8F93",
                        }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item?.description}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: "#60666A",
                        fontSize: RFValue(12),
                        fontFamily: FONTS.REGULAR,
                      }}
                    >
                      {" "}
                      {timeAgo(item?.created_at)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

Notification.propTypes = {
  navigation: PropTypes.object,
};

export default Notification;
