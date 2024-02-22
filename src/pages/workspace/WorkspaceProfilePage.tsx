import React, {useCallback} from 'react';
import {Image, ScrollView, View} from 'react-native';
import {OnyxEntry, withOnyx} from 'react-native-onyx';
import WorkspaceProfile from '@assets/images/workspace-profile.png';
import Avatar from '@components/Avatar';
import AvatarWithImagePicker from '@components/AvatarWithImagePicker';
import * as Expensicons from '@components/Icon/Expensicons';
import * as Illustrations from '@components/Icon/Illustrations';
import MenuItemWithTopDescription from '@components/MenuItemWithTopDescription';
import OfflineWithFeedback from '@components/OfflineWithFeedback';
import Section from '@components/Section';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import useWindowDimensions from '@hooks/useWindowDimensions';
import Navigation from '@libs/Navigation/Navigation';
import * as PolicyUtils from '@libs/PolicyUtils';
import * as ReportUtils from '@libs/ReportUtils';
import * as UserUtils from '@libs/UserUtils';
import * as Policy from '@userActions/Policy';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import type {Currency} from '@src/types/onyx';
import type * as OnyxCommon from '@src/types/onyx/OnyxCommon';
import {isEmptyObject} from '@src/types/utils/EmptyObject';
import withPolicy from './withPolicy';
import type {WithPolicyProps} from './withPolicy';
import WorkspacePageWithSections from './WorkspacePageWithSections';

type CurrencyList = Record<string, Currency>;

type WorkspaceProfilePageOnyxProps = {
    /** Constant, list of available currencies */
    currencyList: OnyxEntry<CurrencyList>;
};

type WorkspaceProfilePageProps = WithPolicyProps & WorkspaceProfilePageOnyxProps;

function WorkspaceProfilePage({policy, currencyList = {}, route}: WorkspaceProfilePageProps) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    const {isSmallScreenWidth} = useWindowDimensions();

    const formattedCurrency =
        !isEmptyObject(policy) && !isEmptyObject(currencyList) && !!policy.outputCurrency ? `${policy.outputCurrency} - ${currencyList[policy.outputCurrency].symbol}` : '';
    const onPressCurrency = useCallback(() => Navigation.navigate(ROUTES.WORKSPACE_PROFILE_CURRENCY.getRoute(policy?.id ?? '')), [policy?.id ?? '']);
    const onPressName = useCallback(() => Navigation.navigate(ROUTES.WORKSPACE_PROFILE_NAME.getRoute(policy?.id ?? '')), [policy?.id ?? '']);
    const onPressDescription = useCallback(() => Navigation.navigate(ROUTES.WORKSPACE_PROFILE_DESCRIPTION.getRoute(policy?.id ?? '')), [policy?.id ?? '']);

    const policyName = policy?.name ?? '';
    const policyDescription = policy?.description ?? '';
    const readOnly = !PolicyUtils.isPolicyAdmin(policy);
    const imageStyle = isSmallScreenWidth ? [styles.mhv12, styles.mhn5] : [styles.mhv8, styles.mhn8];

    return (
        <WorkspacePageWithSections
            headerText={translate('workspace.common.profile')}
            route={route}
            guidesCallTaskID={CONST.GUIDES_CALL_TASK_IDS.WORKSPACE_PROFILE}
            shouldShowLoading={false}
            shouldUseScrollView
            shouldShowOfflineIndicatorInWideScreen
            shouldShowNonAdmin
            icon={Illustrations.House}
        >
            {(hasVBA) => (
                <ScrollView>
                    <View style={[styles.flex1, isSmallScreenWidth ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                        <Section
                            title=""
                            isCentralPane
                        >
                            <Image
                                style={[styles.br4, styles.wAuto, styles.h68, imageStyle]}
                                source={WorkspaceProfile}
                                resizeMode="cover"
                            />
                            <AvatarWithImagePicker
                                onViewPhotoPress={() => Navigation.navigate(ROUTES.WORKSPACE_AVATAR.getRoute(policy?.id ?? ''))}
                                source={policy?.avatar ?? null}
                                size={CONST.AVATAR_SIZE.XLARGE}
                                avatarStyle={styles.avatarXLarge}
                                enablePreview
                                DefaultAvatar={() => (
                                    <Avatar
                                        containerStyles={styles.avatarXLarge}
                                        imageStyles={[styles.avatarXLarge, styles.alignSelfCenter]}
                                        source={policy?.avatar ? policy.avatar : ReportUtils.getDefaultWorkspaceAvatar(policyName)}
                                        fallbackIcon={Expensicons.FallbackWorkspaceAvatar}
                                        size={CONST.AVATAR_SIZE.XLARGE}
                                        name={policyName}
                                        type={CONST.ICON_TYPE_WORKSPACE}
                                    />
                                )}
                                type={CONST.ICON_TYPE_WORKSPACE}
                                fallbackIcon={Expensicons.FallbackWorkspaceAvatar}
                                style={[styles.mb3, styles.mtn17, styles.alignItemsStart, styles.sectionMenuItemTopDescription]}
                                isUsingDefaultAvatar={!policy?.avatar ?? null}
                                onImageSelected={(file: File) => Policy.updateWorkspaceAvatar(policy?.id ?? '', file)}
                                onImageRemoved={() => Policy.deleteWorkspaceAvatar(policy?.id ?? '')}
                                editorMaskImage={Expensicons.ImageCropSquareMask}
                                pendingAction={policy?.pendingFields?.avatar ?? null}
                                errors={policy?.errorFields?.avatar ?? null}
                                onErrorClose={() => Policy.clearAvatarErrors(policy?.id ?? '')}
                                previewSource={UserUtils.getFullSizeAvatar(policy?.avatar, 0)}
                                headerTitle={translate('workspace.common.workspaceAvatar')}
                                originalFileName={policy?.originalFileName}
                                disabled={readOnly}
                                disabledStyle={styles.cursorDefault}
                                errorRowStyles={undefined}
                            />
                            <OfflineWithFeedback pendingAction={policy?.pendingFields?.generalSettings as OnyxCommon.PendingAction}>
                                <MenuItemWithTopDescription
                                    title={policyName}
                                    titleStyle={styles.workspaceTitleStyle}
                                    description={translate('workspace.editor.nameInputLabel')}
                                    shouldShowRightIcon={!readOnly}
                                    disabled={readOnly}
                                    wrapperStyle={[styles.sectionMenuItemTopDescription, isSmallScreenWidth ? styles.mt3 : {}]}
                                    onPress={onPressName}
                                    shouldGreyOutWhenDisabled={false}
                                    shouldUseDefaultCursorWhenDisabled
                                />
                            </OfflineWithFeedback>
                            {(!isEmptyObject(policy?.description) || !readOnly) && (
                                <OfflineWithFeedback pendingAction={policy?.pendingFields?.description as OnyxCommon.PendingAction}>
                                    <MenuItemWithTopDescription
                                        title={policyDescription}
                                        description={translate('workspace.editor.descriptionInputLabel')}
                                        shouldShowRightIcon={!readOnly}
                                        disabled={readOnly}
                                        wrapperStyle={styles.sectionMenuItemTopDescription}
                                        onPress={onPressDescription}
                                        shouldGreyOutWhenDisabled={false}
                                        shouldUseDefaultCursorWhenDisabled
                                        shouldRenderAsHTML
                                    />
                                </OfflineWithFeedback>
                            )}
                            <OfflineWithFeedback pendingAction={policy?.pendingFields?.generalSettings as OnyxCommon.PendingAction}>
                                <View>
                                    <MenuItemWithTopDescription
                                        title={formattedCurrency}
                                        description={translate('workspace.editor.currencyInputLabel')}
                                        shouldShowRightIcon={!readOnly}
                                        disabled={hasVBA || readOnly}
                                        wrapperStyle={styles.sectionMenuItemTopDescription}
                                        onPress={onPressCurrency}
                                        shouldGreyOutWhenDisabled={false}
                                        shouldUseDefaultCursorWhenDisabled
                                    />
                                    <Text style={[styles.textLabel, styles.colorMuted, styles.mt1, styles.mh5, styles.sectionMenuItemTopDescription]}>
                                        {hasVBA ? translate('workspace.editor.currencyInputDisabledText') : translate('workspace.editor.currencyInputHelpText')}
                                    </Text>
                                </View>
                            </OfflineWithFeedback>
                        </Section>
                    </View>
                </ScrollView>
            )}
        </WorkspacePageWithSections>
    );
}

WorkspaceProfilePage.displayName = 'WorkspaceProfilePage';

export default withPolicy(
    withOnyx<WorkspaceProfilePageProps, WorkspaceProfilePageOnyxProps>({
        currencyList: {key: ONYXKEYS.CURRENCY_LIST},
    })(WorkspaceProfilePage),
);
