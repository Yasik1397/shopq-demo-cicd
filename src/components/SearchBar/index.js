//<--------------------------Libraries--------------------------->
import PropTypes from 'prop-types';
import React from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useSelector} from 'react-redux';
import {COLORS, FONTS} from '../../constants/Theme';
import {RFValue} from '../../utils/responsive';
const SearchBar = ({
  onPress,
  isPressable,
  placeholder,
  value,
  onChangeText,
  onSubmitEditing,
  onFocus,
  icon,
  onIconPress,
  style,
  inputStyle,
  iconStyle,
  onBack,
  icon1,
  icon2,
  onIcon1Press,
  onIcon2Press,
  autoFocus,
  type,
}) => {
  const settingsData = useSelector(state => state?.settings?.data);
  const IconColor =
    settingsData?.records?.site_settings?.header?.font_icon_color || '#fff';
  const background_color =
    settingsData?.records?.site_settings?.header?.background_color || '#fff';

  return (
    <View
      style={{
        flex: 1,
        gap: isPressable ? 24 : 8,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {onBack && (
        <Entypo
          name="chevron-left"
          size={RFValue(24)}
          onPress={onBack}
          color={IconColor}
        />
      )}
      <View
        style={[styles.container, style, {backgroundColor: 'rgba(0,0,0,0.1)'}]}>
        {isPressable ? (
          <Pressable style={styles.pressable} onPress={onPress}>
            <View style={styles.innerContainer}>
              {icon && (
                <Pressable
                  onPress={onIconPress}
                  style={[styles.icon, iconStyle]}>
                  <View>{icon}</View>
                </Pressable>
              )}
              <Text style={[styles.placeholderText, inputStyle]}>
                {placeholder}
              </Text>
            </View>
          </Pressable>
        ) : (
          <View style={styles.inputWrapper}>
            {icon && (
              <Pressable onPress={onIconPress} style={[styles.icon, iconStyle]}>
                <View>{icon}</View>
              </Pressable>
            )}
            <TextInput
              autoFocus={autoFocus}
              style={[
                styles.textInput,
                inputStyle,
                {color: type === 'orders' ? COLORS.BLACK : COLORS.WHITE},
              ]}
              placeholder={placeholder}
              value={value}
              onChangeText={onChangeText}
              onSubmitEditing={onSubmitEditing}
              onFocus={onFocus}
              clearButtonMode="always"
              placeholderTextColor={COLORS.GREY}
            />
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 24,
        }}>
        {icon1 ? (
          <Pressable onPress={onIcon1Press}>
            <View>{icon1}</View>
          </Pressable>
        ) : null}
        {icon2 ? (
          <Pressable onPress={onIcon2Press}>
            <View>{icon2}</View>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

SearchBar.propTypes = {
  onPress: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  onFocus: PropTypes.func,
  icon: PropTypes.node,
  onIconPress: PropTypes.func,
  isPressable: PropTypes.bool,
  style: PropTypes.object,
  inputStyle: PropTypes.object,
  iconStyle: PropTypes.object,
  onBack: PropTypes.func,
  icon1: PropTypes.node,
  icon2: PropTypes.node,
  onIcon1Press: PropTypes.func,
  onIcon2Press: PropTypes.func,
  autoFocus: PropTypes.bool,
  type: PropTypes.string,
};

SearchBar.defaultProps = {
  placeholder: 'Enter text',
  isPressable: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.10)',
    borderRadius: 8,
    padding: 8,
  },
  pressable: {
    flex: 1,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: RFValue(14),
    fontFamily: FONTS.REGULAR,
    color: COLORS.WHITE,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: RFValue(14),
    fontFamily: FONTS.MEDIUM,

    paddingVertical: 4,
  },
  icon: {
    marginRight: 8,
  },
});

export default React.memo(SearchBar);
