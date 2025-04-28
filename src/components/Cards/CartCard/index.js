//<--------------------------Libraries--------------------------->
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import FastImage from "react-native-fast-image";
import ActionSheet from "react-native-actions-sheet";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//<--------------------------Components-------------------------->
import PrimaryButton from "../../Buttons/Primary";
import Counter from "../../Counter";
//<--------------------------Assets------------------------------>
// import UnChecked from "../../../assets/Icons/checkbox_unselect.svg";
// import Checked from "../../../assets/Icons/checkbox_select.svg";
import DeleteIcon from "../../../assets/Icons/delete_icon.svg";
import Octicons from "react-native-vector-icons/Octicons";
// import FavIcon from "../../../assets/Icons/fav_blunt.svg";
// import FavFilled from "../../../assets/Icons/fav_filled.svg";

import { COLORS, FONTS } from "../../../constants/Theme";
import { RFValue } from "../../../utils/responsive";
import { capitalizeFirstLetter, truncateText } from "../../../utils/TextFormat";
import { DeleteCart } from "../../BottomSheets/DeleteCart";
import { DefaultImage } from "../../../constants/IMAGES";
import { checkImageAccessibility } from "../../../utils/error";

const CartCard = ({
  data,
  _onPress,
  index,
  onCheck,
  onDelete,
  onFavourite,
  onAdd,
  onSubtract,
}) => {
  const [imageUri, setImageUri] = useState(DefaultImage.products); // Set default image initially
  useEffect(() => {
    const fetchImage = async () => {
      const uri = await checkImageAccessibility(data?.cover_image);
      setImageUri(uri);
    };

    fetchImage();
  }, [data]);
  const [modal, setModal] = useState(false);
  const [cartvalue, setCartvalue] = useState(1);

  const scale = useSharedValue(1);
  const outOfStock = data?.current_stock > 0;
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 5, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 5, stiffness: 300 });
  };

  const Ref = useRef();

  return (
    <Animated.View
      key={index + 1}
      entering={FadeInRight.delay((index + 1) * 50)}
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
      }}
    >
      <Pressable
        onPress={_onPress}
        style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
      >
        {/* Image Section */}
        <FastImage
          style={{ borderRadius: 8, width: 100, height: 110 }}
          source={{
            uri: imageUri,
            priority: FastImage.priority.high,
            cache: "immutable",
          }}
          resizeMode={FastImage.resizeMode.cover}
        />

        {/* Check Box */}

        {!outOfStock ? null : (
          <Pressable
            onPress={onCheck}
            style={{ position: "absolute", bottom: 8, left: 4 }}
          >
            <MaterialCommunityIcons
              onPress={onCheck}
              name={data?.is_selected ? "checkbox-marked" : "checkbox-blank"}
              size={24}
              color={data?.is_selected ? COLORS.PRIMARY : COLORS.WHITE}
            />
          </Pressable>
        )}
        {/* Product Details */}
        <View style={{ flex: 1, gap: 8 }}>
          <Text
            style={{
              color: "#061018",
              fontFamily: FONTS.SEMI_BOLD,
              fontSize: RFValue(14),
            }}
            numberOfLines={1}
          >
            {truncateText(data?.title, 42)}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {data?.variant_name
              ? Object.keys(data?.variant_name)?.map((key, index, array) => (
                  <View
                    key={key}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        color: "#A3A6A8",
                        fontSize: RFValue(12),
                        fontFamily: FONTS.MEDIUM,
                      }}
                    >
                      {capitalizeFirstLetter(key)} :{" "}
                      {truncateText(data?.variant_name[key], 4)}{" "}
                    </Text>
                    {index !== array?.length - 1 && (
                      <Text
                        style={{
                          fontFamily: FONTS.MEDIUM,
                          color: "#A3A6A8",
                          fontSize: RFValue(10),
                        }}
                      >
                        ●
                      </Text>
                    )}
                  </View>
                ))
              : null}
            <Text
              numberOfLines={1}
              style={{
                color: "#A3A6A8",
                fontFamily: FONTS.MEDIUM,
                fontSize: RFValue(12),
              }}
            >
              ● Qty : {data?.quantity}{" "}
            </Text>
            {data?.offer_percentage ? (
              <Text
                style={{
                  fontFamily: FONTS.MEDIUM,
                  color: "#BF4343",
                  fontSize: RFValue(12),
                }}
              >
                {data?.offer_percentage}% off
              </Text>
            ) : null}
          </View>
          {!outOfStock ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: FONTS.BOLD,
                  fontSize: RFValue(18),
                  color: !outOfStock ? "#A3A6A8" : "#061018",
                }}
              >
                &#8377; {data?.selling_price * data?.quantity}{" "}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(12),
                    fontFamily: FONTS.MEDIUM,
                    verticalAlign: "middle",
                    textAlignVertical: "center",
                    textDecorationLine: "line-through",
                    color: "#A3A6A8",
                  }}
                >
                  {(data?.tax_included_price * data?.quantity).toLocaleString()}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Counter
                onAdd={onAdd}
                onSubtract={onSubtract}
                disabled={!data?.is_selected}
                onPress={() => setModal(true)}
                data={data?.quantity}
              />
              <View />
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View>
                {!outOfStock ? (
                  <View
                    style={{
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: RFValue(14),
                        color: "#BF4343",
                        fontFamily: FONTS.MEDIUM,
                      }}
                    >
                      Out of stock
                    </Text>
                  </View>
                ) : !data?.is_active ? (
                  <View
                    style={{
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: RFValue(14),
                        fontFamily: FONTS.MEDIUM,
                        color: "#BF4343",
                      }}
                    >
                      Currently Unavailable
                    </Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontFamily: FONTS.BOLD,
                        fontSize: RFValue(18),
                        color: "#061018",
                      }}
                    >
                      &#8377;{" "}
                      {(data?.selling_price * data?.quantity).toLocaleString()}{" "}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: RFValue(12),
                          fontFamily: FONTS.MEDIUM,
                          verticalAlign: "middle",
                          textAlignVertical: "center",
                          textDecorationLine: "line-through",
                        }}
                      >
                        {(
                          data?.tax_included_price * data?.quantity
                        ).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
            >
              <Animated.View style={animatedStyle}>
                <Pressable
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={onFavourite}
                >
                  {data?.is_favourite ? (
                    <Octicons name="heart-fill" size={20} color={"#EF1F21"} />
                  ) : (
                    <Octicons name="heart" size={20} color={"#9B9FA3"} />
                  )}
                </Pressable>
              </Animated.View>
              <Pressable onPress={onDelete}>
                <DeleteIcon />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>

      {/* Quantity Modal */}
      <Modal
        statusBarTranslucent
        animationType="fade"
        transparent={true}
        visible={modal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ gap: 10 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: FONTS.SEMI_BOLD,
                  fontSize: RFValue(16),
                  color: "#0E1827",
                }}
              >
                Quantity
              </Text>
              <TextInput
                style={{
                  padding: 10,
                  borderWidth: 1,
                  borderColor: "#E6E7E8",
                  borderRadius: 5,
                  color: "#0E1827",
                  fontSize: RFValue(16),
                }}
                placeholder="Quantity"
                inputMode="numeric"
                value={cartvalue}
                onChangeText={(text) => {
                  setCartvalue(text);
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 15,
                gap: 10,
              }}
            >
              <PrimaryButton
                title={"Cancel"}
                onPress={() => {
                  setCartvalue(1);
                  setModal(!modal);
                }}
                otherstyles={{
                  borderRadius: 12,
                  paddingHorizontal: 40,
                  paddingVertical: 16,
                }}
                backgroundColor={COLORS.WHITE}
                textColor={COLORS.BLACK}
              />
              <PrimaryButton
                title={"Apply"}
                onPress={() => {}}
                otherstyles={{
                  borderRadius: 12,
                  paddingHorizontal: 40,
                  paddingVertical: 16,
                }}
                backgroundColor={"#0E1827"}
                textColor={COLORS.WHITE}
              />
            </View>
          </View>
        </View>
      </Modal>
      {/* Delete Cart Popup */}
      <ActionSheet
        indicatorStyle={{ backgroundColor: "#D0D1D1", marginTop: 12 }}
        animated
        closable
        gestureEnabled
        ref={Ref}
        containerStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        closeOnPress={false}
      >
        <DeleteCart />
      </ActionSheet>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
});

CartCard.propTypes = {
  data: PropTypes.object,
  onPress: PropTypes.func,
  index: PropTypes.number,
  onDelete: PropTypes.func,
  onFavourite: PropTypes.func,
  onCheck: PropTypes.func,
  onAdd: PropTypes.func,
  onSubtract: PropTypes.func,
  _onPress: PropTypes.func,
};
export default React.memo(CartCard);
