import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useGetMyordersQuery } from "../../../../Api/EndPoints/orders";

import Filter from "../../../../assets/Icons/filter_icon.svg";

import ActionSheet from "react-native-actions-sheet";
import SortPopup from "../../../../components/BottomSheets/Sort";
import NoProducts from "../../../../components/EmptyScreen/NoProducts";
import PrimaryHeader from "../../../../components/Header";
import SearchBar from "../../../../components/SearchBar";

import SearchIcon from "../../../../assets/Icons/search.svg";
import { COLORS } from "../../../../constants/Theme";
import { DateField } from "../../../../utils/dateFormat";
import { StatusTextColor } from "../../../../utils/deliveryStatus";
import CheckoutCard from "../../../../components/Cards/CheckoutCard";
import { useSelector } from "react-redux";

const MyOrders = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [value, setvalue] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const refRBSheet = useRef();
  const user = useSelector((state) => state?.Userdata?.user?.records);
  const {
    data: myorders,
    refetch,
    isFetching,
  } = useGetMyordersQuery({
    userid: user?.id,
    search_value: value || "",
    sort_value: selectedOption || "",
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (myorders) {
      refetch()
        .then(() => setRefreshing(false))
        .catch(() => {
          setRefreshing(false);
        });
    } else {
      setRefreshing(false);
    }
  }, [myorders, refetch]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <PrimaryHeader
        headerName="My Orders"
        onPress={() => navigation.goBack()}
      />
      <View
        style={{
          flexDirection: "row",
          padding: 16,
        }}
      >
        <SearchBar
        type="orders"
          icon={<SearchIcon />}
          icon1={
            <TouchableOpacity
              disabled={!myorders}
              onPress={() => refRBSheet?.current?.show()}
            >
              <Filter opacity={!myorders ? 0.5 : 1} />
            </TouchableOpacity>
          }
          onChangeText={(txt) => {
            setvalue(txt), refetch();
          }}
          value={value}
          placeholder={"Search Orders"}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <FlatList
          scrollEnabled={false}
          data={myorders?.records || []}
          ListEmptyComponent={() => {
            return <NoProducts type={"Myorders"} />;
          }}
          ItemSeparatorComponent={() => {
            return <View style={{ height: 16 }} />;
          }}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12 }}
          renderItem={({ item, index }) => {
            return (
              <CheckoutCard
                index={index}
                data={item}
                onPress={() =>
                  navigation.navigate("OrderinfoScreen", {
                    order_id: item?.order_id,
                  })
                }
                textColor={StatusTextColor(item?.status)}
                deliveryDate={
                  item?.cart_details?.product_details?.status === "Delivered"
                    ? DateField(item?.deliveryDate, "DD/MM/YYYY")
                    : DateField(item?.expected_delivery, "DD/MM/YYYY")
                }
                isloading={isFetching}
              />
            );
          }}
        />
      </ScrollView>
      <ActionSheet
        indicatorStyle={{ backgroundColor: "#D0D1D1", marginTop: 12 }}
        containerStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        closable
        gestureEnabled
        openAnimationConfig={{
          timing: { duration: 500 },
          bounciness: 0,
        }}
        ref={refRBSheet}
      >
        <SortPopup
          selected={selectedOption}
          title={"Filter"}
          sub_title={"Reset"}
          onPress_reset={() => {
            setSelectedOption([]);
          }}
          options={["Ordered", "Shipped", "Out for delivery", "Delivered"]}
          setselected={setSelectedOption}
          type={"orders"}
          onCancel={() => refRBSheet?.current?.hide()}
        />
      </ActionSheet>
    </SafeAreaView>
  );
};
MyOrders.propTypes = {
  navigation: PropTypes.object,
};
export default React.memo(MyOrders);
