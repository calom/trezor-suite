import React, { useRef } from 'react';
import ReactSelect, {
    components,
    Props as SelectProps,
    OptionsType,
    GroupedOptionsType,
    StylesConfig,
} from 'react-select';
import styled, { css } from 'styled-components';
import { variables } from '../../../config';
import { getStateColor, useTheme } from '../../../utils';
import { InputVariant, InputState, SuiteThemeColors } from '../../../support/types';

const selectStyle = (
    isSearchable: boolean,
    withDropdownIndicator = true,
    variant: InputVariant,
    hideTextCursor: boolean,
    isClean: boolean,
    minWidth: string,
    borderRadius: number,
    borderWidth: number,
    theme: SuiteThemeColors,
    selectState?: InputState,
): StylesConfig<Option, boolean> => ({
    singleValue: base => ({
        ...base,
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 'initial',
        margin: 0,
        padding: '0 8px',
        color: isClean ? theme.TYPE_LIGHT_GREY : theme.TYPE_DARK_GREY,
        fontSize: variables.NEUE_FONT_SIZE.SMALL,
        fontWeight: variables.FONT_WEIGHT.MEDIUM,
        borderStyle: 'none',
        justifyContent: isClean ? 'flex-end' : 'flex-start',
        '&:hover': {
            cursor: hideTextCursor || !isSearchable ? 'pointer' : 'text',
        },
    }),
    control: (base, { isDisabled, isFocused }) => {
        let height = variant === 'small' ? '36px' : '48px';
        const borderColor = selectState ? getStateColor(selectState, theme) : theme.STROKE_GREY;

        if (isClean) height = '22px';

        return {
            ...base,
            display: 'flex',
            alignItems: 'center',
            fontSize: variables.FONT_SIZE.SMALL,
            height,
            borderRadius: `${borderRadius}px`,
            borderWidth: `${borderWidth}px`,
            borderColor,
            borderStyle: isClean ? 'none' : 'solid',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            flexWrap: 'nowrap',
            '&:hover, &:focus': {
                cursor: 'pointer',
                borderRadius: `${borderRadius}px`,
                borderWidth: `${borderWidth}px`,
                borderColor,
            },
        };
    },
    valueContainer: base =>
        ({
            ...base,
            border: 0,
            padding: isClean ? '0 3px 0 0' : '2px 8px',
            fontWeight: isClean ? variables.FONT_WEIGHT.MEDIUM : variables.FONT_WEIGHT.REGULAR,
            minWidth,
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: isClean ? 'flex-end' : 'flex-start',
        } as const),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    dropdownIndicator: (base, { isDisabled, isFocused }) => ({
        ...base,
        display: !withDropdownIndicator || isDisabled ? 'none' : 'flex',
        alignItems: 'center',
        color: isClean ? theme.TYPE_LIGHTER_GREY : theme.TYPE_LIGHT_GREY,
        cursor: 'pointer',
        path: '',
        padding: isClean ? 0 : '8px',
        transform: isFocused ? 'rotate(180deg)' : 'none',
        transition: `transform 0.24s ease-in-out`,
        '&:hover': {
            color: isClean ? theme.TYPE_LIGHT_GREY : theme.TYPE_DARK_GREY,
        },
    }),
    menu: base => ({
        ...base,
        width: 'max-content',
        minWidth: '100%',
        background: theme.BG_WHITE_ALT,
        margin: '5px 0',
        boxShadow: `box-shadow: 0 4px 10px 0 ${theme.BOX_SHADOW_BLACK_20}`,
        zIndex: 9,
    }),
    menuList: base => ({
        ...base,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        background: theme.BG_WHITE_ALT,
        borderRadius: '4px',
        padding: '8px',
    }),
    // textTransform does not work in TS with makeStyles => base: any
    groupHeading: base => ({
        ...base,
        fontSize: variables.NEUE_FONT_SIZE.TINY,
        textTransform: 'initial',
        margin: 0,
        padding: '8px',
    }),
    group: base => ({
        ...base,
        padding: 0,
        '& + &': {
            borderTop: `1px solid ${theme.BG_WHITE_ALT_HOVER}`,
            paddingTop: '4px',
            marginTop: '4px',
        },
    }),
    option: (base, { isFocused }) => ({
        ...base,
        color: theme.TYPE_DARK_GREY,
        background: isFocused ? theme.BG_WHITE_ALT_HOVER : theme.BG_WHITE_ALT,
        borderRadius: '5px',
        padding: '8px',
        fontSize: variables.NEUE_FONT_SIZE.SMALL,
        fontWeight: variables.FONT_WEIGHT.MEDIUM,
        '&:hover': {
            cursor: 'pointer',
            background: theme.BG_WHITE_ALT_HOVER,
        },
        '&:active': {
            background: theme.BG_WHITE_ALT_HOVER,
        },
    }),
    input: base => ({
        ...base,
        fontSize: variables.NEUE_FONT_SIZE.NORMAL,
        color: hideTextCursor ? 'transparent' : theme.TYPE_DARK_GREY,
        '& input': {
            textShadow: hideTextCursor ? `0 0 0 ${theme.TYPE_DARK_GREY} !important` : 'none',
        },
    }),
    placeholder: base => ({
        ...base,
        fontWeight: variables.FONT_WEIGHT.MEDIUM,
        fontSize: variables.NEUE_FONT_SIZE.SMALL,
        padding: '0 6px',
    }),
});

const Wrapper = styled.div<Props>`
    width: ${props => (props.width ? `${props.width}px` : '100%')};

    ${props =>
        !props.isClean &&
        css`
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        `}

    .react-select__single-value {
        position: static;
        transform: none;
    }
`;

const Label = styled.span`
    min-height: 32px;
    font-size: ${variables.FONT_SIZE.NORMAL};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
`;

const BottomText = styled.div<Props>`
    display: flex;
    font-size: ${variables.FONT_SIZE.TINY};
    color: ${props => getStateColor(props.state, props.theme)};
    padding: 10px 10px 0 10px;
    min-height: 27px;
`;

interface Option {
    value: string;
    label: string;
}

/** Custom Type Guards to check if options are grouped or not */
const isOptionGrouped = (
    x: OptionsType<Option> | GroupedOptionsType<Option>,
): x is GroupedOptionsType<Option> => (x as GroupedOptionsType<Option>)[0]?.options !== undefined;

interface CommonProps extends Omit<SelectProps, 'components' | 'isSearchable'> {
    withDropdownIndicator?: boolean;
    isClean?: boolean;
    label?: React.ReactNode;
    wrapperProps?: Record<string, any>;
    variant?: InputVariant;
    noTopLabel?: boolean;
    noError?: boolean;
    bottomText?: React.ReactNode;
    hideTextCursor?: boolean; // this prop hides blinking text cursor
    minWidth?: string;
    borderWidth?: number;
    borderRadius?: number;
    state?: InputState;
}

// Make sure isSearchable can't be defined if useKeyPressScroll===true
// If useKeyPressScroll is false or undefined, isSearchable is a boolean value
type KeyPressScrollProps =
    | { useKeyPressScroll: true; isSearchable?: never }
    | { useKeyPressScroll?: false; isSearchable?: boolean };

type Props = CommonProps & KeyPressScrollProps;

const Select = ({
    hideTextCursor = false,
    withDropdownIndicator = true,
    className,
    wrapperProps,
    isClean = false,
    label,
    width,
    variant = 'large',
    noTopLabel = false,
    noError = true,
    bottomText,
    useKeyPressScroll,
    isSearchable = false,
    minWidth = 'initial',
    borderWidth = 2,
    borderRadius = 4,
    state,
    ...props
}: Props) => {
    const selectRef: React.RefObject<ReactSelect<Option>> | null | undefined = useRef(null);

    const theme = useTheme();

    // values used for custom scroll-search behavior
    const lastKeyPressTimestamp = useRef(0); // timestamp at which last keyPress event occurred
    const searchedTerm = useRef(''); // string which the user wants to find

    // customize control to pass data-test attribute
    const Control = (controlProps: any) => (
        <components.Control
            {...controlProps}
            innerProps={{
                ...controlProps.innerProps,
                'data-test': `${props['data-test']}/input`,
            }}
        />
    );

    // customize options to pass data-test attribute
    const Option = (optionProps: any) => (
        <components.Option
            {...optionProps}
            innerProps={{
                ...optionProps.innerProps,
                'data-test': `${props['data-test']}/option/${optionProps.value}`,
            }}
        />
    );

    const GroupHeading = (groupHeadingProps: any) =>
        groupHeadingProps?.data?.label ? <components.GroupHeading {...groupHeadingProps} /> : null;

    const findOption = (options: OptionsType<Option>, query: string) => {
        // Option that will be returned
        let foundOption;

        // Save how far is the query from the beginning of option label (e.g. index of "c" in "Bitcoin" is 3)
        // This way I can give priority to options which START with the query. (Otherwise I would just return first option that CONTAINS searched term)
        let lowestIndexOfFirstOccurrence = Infinity;

        // Loop over all options
        for (let i = 0; i < options.length; i++) {
            // Find where in the option the query is located (returns -1 if not found)
            const indexOfFirstOccurrence = (options[i].label || '')
                .toLowerCase()
                .indexOf(query.toLowerCase());

            // If the query was found and it is closer to the beginning than the closes match so far, set new foundOption.
            // (This ensures that if I press "B", I return the first option STARTING with "B", not the first option CONTAINING "B")
            if (
                indexOfFirstOccurrence >= 0 &&
                indexOfFirstOccurrence < lowestIndexOfFirstOccurrence
            ) {
                lowestIndexOfFirstOccurrence = indexOfFirstOccurrence;
                foundOption = options[i];
            }
        }

        // returns "undefined" if no option was found
        return foundOption;
    };

    const scrollToOption = (option: Option) => {
        if (selectRef.current) {
            // I found a way how to scroll on and option in this tutorial: https://github.com/JedWatson/react-select/issues/3648
            selectRef.current.select.scrollToFocusedOptionOnUpdate = true;
            selectRef.current.select.setState({
                focusedValue: null,
                focusedOption: option,
            });
        }
    };

    const onKeyDown = async (event: React.KeyboardEvent) => {
        // This function is executed when user presses keyboard
        if (useKeyPressScroll) {
            // Get value of the key pressed by the user
            const charValue = event.key;

            // Get current timestamp and check how long it is since the last keyPress event happened.
            const currentTimestamp = new Date().getTime();
            const timeSincePreviousKeyPress = currentTimestamp - lastKeyPressTimestamp.current;

            // Save current timestamp to lastKeyPressTime variable
            lastKeyPressTimestamp.current = currentTimestamp;

            // If user didn't type anything for 0.8 seconds, set searchedValue to just pressed key, otherwise add the new value to the old one
            if (timeSincePreviousKeyPress > 800) {
                searchedTerm.current = charValue;
            } else {
                searchedTerm.current += charValue;
            }

            if (selectRef.current) {
                // Get options object
                const { options } = selectRef.current.select.props;

                if (options && options.length > 1) {
                    /*
                    First, check if the options are divided into sub-categories.
                    For example <NetworkSelect> has options divided into sub-categories "mainnet" and "testnet".
                    In such scenario I need to loop through all of the sub-categories and try to find appropriate option in them as well.
                    */

                    // array of all options in which I want to find the searched term
                    let optionsToSearchThrough: OptionsType<Option> = [];

                    if (isOptionGrouped(options)) {
                        // Options are nested. Loop through all of the sub-categories and concatenate them into one array
                        // Condition is based on the format of the first item,
                        // I am not sure if it is possible to have both grouped and ungrouped items at the same time
                        // if so than this is not going to work very well, but it can be fixed easily (just check each item if it is a group or not, and adjust the typeguard to type the item instead of whole options array)
                        options.forEach(o => {
                            optionsToSearchThrough = optionsToSearchThrough.concat(o.options);
                        });
                    } else {
                        // If the options aren't divided into sub-categories, you can use the default options array that is present on "selectRef"
                        optionsToSearchThrough = options;
                    }

                    // Find the option
                    const optionToFocusOn = findOption(
                        optionsToSearchThrough,
                        searchedTerm.current,
                    );

                    // Also get the last option, so I can scroll to it later
                    const lastOption = optionsToSearchThrough[optionsToSearchThrough.length - 1];

                    // Make sure all the necessary options are defined
                    if (optionToFocusOn && lastOption) {
                        /*
                        Here we first scroll to the last option in option-list and then we scroll to the focused option.

                        The reason why I want to scroll to the last option first is, that I want the focused item to
                        appear on the top of the list - I achieve that behavior by scrolling "from bottom-to-top".
                        The default scrolling behavior is "from top-to-bottom". In that case the focused option appears at the bottom
                        of options list, which is not a great UX.

                        If we don't require the focused option to be on top, just delete 'await scrollToOption(lastOption);'
                        */

                        // 1. scroll to the last option first and wait
                        await scrollToOption(lastOption);

                        // 2. scroll to the selected option
                        scrollToOption(optionToFocusOn);
                    }
                }
            }
        }
    };

    return (
        <Wrapper className={className} width={width} isClean={isClean} {...wrapperProps}>
            {!noTopLabel && <Label>{label}</Label>}

            <ReactSelect
                ref={selectRef}
                onKeyDown={onKeyDown}
                classNamePrefix="react-select"
                styles={selectStyle(
                    isSearchable,
                    withDropdownIndicator,
                    variant,
                    hideTextCursor,
                    isClean,
                    minWidth,
                    borderRadius,
                    borderWidth,
                    theme,
                    state,
                )}
                isSearchable={isSearchable}
                {...props}
                components={{ Control, Option, GroupHeading, ...props.components }}
            />

            {!noError && <BottomText state={state}>{bottomText}</BottomText>}
        </Wrapper>
    );
};

export type { Props as SelectProps };
export { Select };
