/**
 * Inovio Credit Card Payment Method - WooCommerce Blocks
 *
 * Registers the Inovio Credit Card payment method with WooCommerce Blocks.
 *
 * @package Inovio_Payment_Gateway
 * @since 6.0.0
 */

import { decodeEntities } from '@wordpress/html-entities';
import { PaymentForm } from './components/payment-form';

const { getSetting } = window.wc.wcSettings;
const settings = getSetting( 'inoviodirectmethod_data', {} );

/**
 * Label component
 *
 * @param {Object} props Component props
 * @return {JSX.Element} Label component
 */
const Label = ( props ) => {
    const { PaymentMethodLabel } = props.components;
    const label = decodeEntities( settings.title || 'Credit Card (Inovio)' );

    return <PaymentMethodLabel text={ label } />;
};

/**
 * Content component (displays when payment method is selected)
 *
 * @param {Object} props Component props
 * @return {JSX.Element} Payment form component
 */
const Content = ( props ) => {
    return <PaymentForm { ...props } />;
};

/**
 * Credit Card payment method configuration
 */
export const creditCardMethod = {
    name: 'inoviodirectmethod',
    label: <Label />,
    content: <Content />,
    edit: <Content />,
    canMakePayment: () => true,
    ariaLabel: decodeEntities( settings.title || 'Credit Card (Inovio)' ),
    supports: {
        features: settings.supports || [],
    },
};
