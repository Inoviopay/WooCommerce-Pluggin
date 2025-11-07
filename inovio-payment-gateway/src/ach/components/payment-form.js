/**
 * Inovio ACH Payment Form Component
 *
 * Renders the ACH bank payment form and handles data submission for WooCommerce Blocks.
 *
 * @package Inovio_Payment_Gateway
 * @since 6.0.0
 */

import { useState, useEffect } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { ValidatedTextInput } from '@woocommerce/blocks-checkout';
import { RadioControl } from '@wordpress/components';

const { getSetting } = window.wc.wcSettings;
const settings = getSetting( 'achinoviomethod_data', {} );

/**
 * Payment Form Component
 *
 * @param {Object} props Component props
 * @param {Object} props.eventRegistration Event registration object
 * @param {Object} props.emitResponse Response emitter
 * @return {JSX.Element} Payment form
 */
export const PaymentForm = ( props ) => {
    const { eventRegistration, emitResponse } = props;
    const { onPaymentSetup } = eventRegistration;

    const [accountHolder, setAccountHolder] = useState( '' );
    const [accountNumber, setAccountNumber] = useState( '' );
    const [routingNumber, setRoutingNumber] = useState( '' );
    const [accountType, setAccountType] = useState( 'checking' );

    /**
     * Register payment processing handler
     */
    useEffect( () => {
        const unsubscribe = onPaymentSetup( () => {
            return {
                type: emitResponse.responseTypes.SUCCESS,
                meta: {
                    paymentMethodData: {
                        account_holder: accountHolder.trim(),
                        account_number: accountNumber.replace( /\D/g, '' ),
                        routing_number: routingNumber.replace( /\D/g, '' ),
                        account_type: accountType,
                    },
                },
            };
        } );

        return () => unsubscribe();
    }, [ onPaymentSetup, accountHolder, accountNumber, routingNumber, accountType, emitResponse.responseTypes.SUCCESS ] );

    /**
     * Handle numeric input (remove non-digits)
     *
     * @param {Event} e Input event
     * @return {string} Numeric only string
     */
    const handleNumericInput = ( e ) => {
        return e.target.value.replace( /\D/g, '' );
    };

    return (
        <div className="wc-block-components-text">
            { settings.description && (
                <p>{ decodeEntities( settings.description ) }</p>
            ) }

            <>
                <ValidatedTextInput
                    id="inovio-account-holder"
                    type="text"
                    label="Account Holder Name"
                    value={ accountHolder }
                    onChange={ ( newValue ) => setAccountHolder( newValue ) }
                    required
                    autoComplete="name"
                />

                <ValidatedTextInput
                    id="inovio-account-number"
                    type="text"
                    label="Account Number"
                    value={ accountNumber }
                    onChange={ ( newValue ) => setAccountNumber( newValue.replace( /\D/g, '' ) ) }
                    required
                />

                <ValidatedTextInput
                    id="inovio-routing-number"
                    type="text"
                    label="Routing Number"
                    value={ routingNumber }
                    onChange={ ( newValue ) => setRoutingNumber( newValue.replace( /\D/g, '' ) ) }
                    required
                />

                <RadioControl
                    label="Account Type"
                    selected={ accountType }
                    options={ [
                        { label: 'Checking', value: 'checking' },
                        { label: 'Savings', value: 'savings' },
                    ] }
                    onChange={ setAccountType }
                />
            </>
        </div>
    );
};
