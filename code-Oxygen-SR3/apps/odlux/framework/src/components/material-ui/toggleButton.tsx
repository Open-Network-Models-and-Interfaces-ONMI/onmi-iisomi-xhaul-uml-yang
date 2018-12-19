
import * as React from 'react';
import classNames from 'classnames';
import { withStyles, WithStyles, Theme, createStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ButtonBase, { ButtonBaseClassKey, ButtonBaseProps } from '@material-ui/core/ButtonBase';
import { StandardProps } from '@material-ui/core';

export const styles = (theme: Theme) => createStyles({
    /* Styles applied to the root element. */
    root: {
        ...theme.typography.button,
        height: 32,
        minWidth: 48,
        margin: 0,
        padding: `${theme.spacing.unit - 4}px ${theme.spacing.unit * 1.5}px`,
        borderRadius: 2,
        willChange: 'opacity',
        color: fade(theme.palette.action.active, 0.38),
        '&:hover': {
            textDecoration: 'none',
            // Reset on mouse devices
            backgroundColor: fade(theme.palette.text.primary, 0.12),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
            '&$disabled': {
                backgroundColor: 'transparent',
            },
        },
        '&:not(:first-child)': {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
        },
        '&:not(:last-child)': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        },
    },
    /* Styles applied to the root element if `disabled={true}`. */
    disabled: {
        color: fade(theme.palette.action.disabled, 0.12),
    },
    /* Styles applied to the root element if `selected={true}`. */
    selected: {
        color: theme.palette.action.active,
        '&:after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            overflow: 'hidden',
            borderRadius: 'inherit',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            pointerEvents: 'none',
            zIndex: 0,
            backgroundColor: 'currentColor',
            opacity: 0.38,
        },
        '& + &:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            overflow: 'hidden',
            width: 1,
            height: '100%',
            left: 0,
            top: 0,
            pointerEvents: 'none',
            zIndex: 0,
            backgroundColor: 'currentColor',
            opacity: 0.12,
        },
    },
    /* Styles applied to the `label` wrapper element. */
    label: {
        width: '100%',
        display: 'inherit',
        alignItems: 'inherit',
        justifyContent: 'inherit',
    },
});

export type ToggleButtonClassKey = 'disabled' | 'root' | 'label' | 'selected';

interface IToggleButtonProps extends WithStyles<typeof styles> {
    className?: string;
    component?: React.ReactType<IToggleButtonProps>;
    disabled?: boolean;
    disableFocusRipple?: boolean;
    disableRipple?: boolean;
    selected?: boolean;
    type?: string;
    value?: any;
    onClick?: (event: React.FormEvent<HTMLElement>, value?: any) => void;
    onChange?: (event: React.FormEvent<HTMLElement>, value?: any) => void;
}

class ToggleButton extends React.Component<IToggleButtonProps> {
    handleChange = (event: React.FormEvent<HTMLElement>) => {
        const { onChange, onClick, value } = this.props;

        if (onClick) {
            onClick(event, value);
            if (event.isDefaultPrevented()) {
                return;
            }
        }

        if (onChange) {
            onChange(event, value);
        }
    };

    render() {
        const {
            children,
            className: classNameProp,
            classes,
            disableFocusRipple,
            disabled,
            selected,
            ...other
        } = this.props;

        const className = classNames(
            classes.root,
            {
                [classes.disabled]: disabled,
                [classes.selected]: selected,
            },
            classNameProp,
        );

        return (
            <ButtonBase
                className={className}
                disabled={disabled}
                focusRipple={!disableFocusRipple}
                onClick={this.handleChange}
                {...other}
            >
                <span className={classes.label}>{children}</span>
            </ButtonBase>
        );
    }
    public static defaultProps = {
        disabled: false,
        disableFocusRipple: false,
        disableRipple: false,
    };

    public static muiName = 'ToggleButton';
}

export default withStyles(styles, { name: 'MuiToggleButton' })(ToggleButton);