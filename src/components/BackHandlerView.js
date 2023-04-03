import React, { useMemo, useRef } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../theme/themeExport';
import { CapitalizeFirst, useTranslation } from '../translations';
import Button from './Button';
import KeyboardAvoidingView from './KeyboardAvoidingView';
import Text from './Text';

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: 150,
  },
});

const BackHandlerView = React.memo(
  ({
    handleBack,
    hide,
    darkHeaderTheme,
    children,
    headerImage,
    headerImageHeight,
    cancelText,
    title,
    resetScrollview,
  }) => {
    const { t } = useTranslation();
    const scrollViewRef = useRef();

    useMemo(() => {
      scrollViewRef?.current?.scrollTo({ x: 0, y: 0, animated: false });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetScrollview]);

    return (
      <SafeAreaView style={[theme.common.container, { flex: 1 }]}>
        <StatusBar
          backgroundColor={theme.variables.statusBarBgDark}
          barStyle={theme.variables.statusBarColorLight}
        />
        <View
          style={[
            styles.header,
            darkHeaderTheme ? { backgroundColor: theme.variables.secondary } : '',
          ]}>
          <Icon
            name="arrow-left"
            color={darkHeaderTheme ? theme.variables.textInverse : theme.variables.textColor}
            onPress={handleBack}
            size={24}
            style={theme.common.spaceAround}
          />
          {title && (
            <Text
              content={title}
              color={darkHeaderTheme ? theme.variables.textInverse : theme.variables.textColor}
            />
          )}
          <Button
            onPress={hide}
            type="link"
            color={darkHeaderTheme ? theme.variables.textInverse : theme.variables.textColor}
            text={cancelText || CapitalizeFirst(t('genericButton.cancel'))}
          />
        </View>
        <KeyboardAvoidingView>
          <ScrollView ref={scrollViewRef}>
            <>
              {headerImage ? (
                <Image
                  style={[
                    styles.headerImage,
                    headerImageHeight ? { height: headerImageHeight } : {},
                  ]}
                  source={headerImage}
                />
              ) : null}
              <View style={theme.common.contentContainer}>{children}</View>
            </>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  },
);

BackHandlerView.displayName = 'BackHandlerView';
export default BackHandlerView;
