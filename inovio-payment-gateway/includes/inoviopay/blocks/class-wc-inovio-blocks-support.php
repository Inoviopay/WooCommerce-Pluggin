<?php
/**
 * Inovio Credit Card Payment Method Blocks Support
 *
 * Provides WooCommerce Blocks integration for the Inovio Credit Card payment gateway.
 *
 * @package Inovio_Payment_Gateway
 * @since 6.0.0
 */

use Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType;

/**
 * Inovio Blocks Support Class
 *
 * Extends AbstractPaymentMethodType to provide WooCommerce Blocks compatibility
 * for the Inovio Credit Card payment gateway.
 */
final class WC_Inovio_Blocks_Support extends AbstractPaymentMethodType {

    /**
     * Payment method name/id/slug
     *
     * @var string
     */
    protected $name = 'inoviodirectmethod';

    /**
     * Instance of the payment gateway
     *
     * @var Woocommerce_Inovio_Gateway
     */
    private $gateway;

    /**
     * Initialize the payment method
     *
     * @return void
     */
    public function initialize() {
        // Get gateway settings
        $this->settings = get_option( 'woocommerce_inoviodirectmethod_settings', [] );

        // Get gateway instance
        $gateways = WC()->payment_gateways->payment_gateways();
        $this->gateway = isset( $gateways[ $this->name ] ) ? $gateways[ $this->name ] : null;
    }

    /**
     * Check if payment method is active
     *
     * @return boolean
     */
    public function is_active() {
        return ! empty( $this->settings['enabled'] ) && 'yes' === $this->settings['enabled'];
    }

    /**
     * Returns an array of script handles to enqueue in the frontend context
     *
     * @return string[]
     */
    public function get_payment_method_script_handles() {
        $script_path = '/build/index.js';
        $script_asset_path = dirname( dirname( dirname( dirname( __FILE__ ) ) ) ) . '/build/index.asset.php';
        $script_asset = file_exists( $script_asset_path )
            ? require $script_asset_path
            : [
                'dependencies' => [],
                'version' => filemtime( dirname( dirname( dirname( dirname( __FILE__ ) ) ) ) . $script_path )
            ];

        $script_url = plugins_url( $script_path, dirname( dirname( dirname( dirname( __FILE__ ) ) ) ) . '/woocommerce-inovio-gateway.php' );

        wp_register_script(
            'wc-inovio-blocks-integration',
            $script_url,
            $script_asset['dependencies'],
            $script_asset['version'],
            true
        );

        return [ 'wc-inovio-blocks-integration' ];
    }

    /**
     * Returns an array of key=>value pairs of data made available to the payment methods script
     *
     * @return array
     */
    public function get_payment_method_data() {
        return [
            'title'       => $this->get_setting( 'title' ),
            'description' => $this->get_setting( 'description' ),
            'supports'    => $this->get_supported_features(),
            'icon'        => plugins_url( '/assets/img/inovio-logo.png', dirname( dirname( dirname( dirname( __FILE__ ) ) ) ) . '/woocommerce-inovio-gateway.php' ),
        ];
    }

    /**
     * Get supported gateway features
     *
     * @return array
     */
    public function get_supported_features() {
        if ( ! $this->gateway ) {
            return [];
        }

        $supported_features = [];

        // Check which features this gateway supports
        if ( isset( $this->gateway->supports ) && is_array( $this->gateway->supports ) ) {
            foreach ( $this->gateway->supports as $feature ) {
                $supported_features[] = $feature;
            }
        }

        return $supported_features;
    }
}
