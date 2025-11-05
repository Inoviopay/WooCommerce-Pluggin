<?php

/**
 * Create table on activate inovio plugin
 */
function create_inovio_plugin_database_table() {
	global $wpdb;
	$charset_collate = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE {$wpdb->prefix}inovio_refunded (
                  id bigint(20) NOT NULL AUTO_INCREMENT,
                  inovio_order_id bigint(20) NOT NULL,
                  inovio_refunded_amount varchar(256),
                  PRIMARY KEY  (id),
                  KEY inovio_order_id (inovio_order_id)
                ) ENGINE=InnoDB $charset_collate;";

		require_once ABSPATH . '/wp-admin/includes/upgrade.php';
		dbDelta( $sql );
}

/**
 * Create table on activate inovio plugin
 */
function create_ach_inovio_plugin_database_table() {
	global $wpdb;
	$charset_collate = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE {$wpdb->prefix}ach_inovio_refunded (
                  id bigint(20) NOT NULL AUTO_INCREMENT,
                  ach_inovio_order_id bigint(20) NOT NULL,
                  ach_inovio_refunded_amount varchar(256),
                  PRIMARY KEY  (id),
                  KEY ach_inovio_order_id (ach_inovio_order_id)
                ) ENGINE=InnoDB $charset_collate;";

		require_once ABSPATH . '/wp-admin/includes/upgrade.php';
		dbDelta( $sql );
}
/**
 * Delete inovio_plugin_database_table on deactivate plugin
 */

function drop_inovio_plugin_database_table() {
	global $wpdb;
	$sql = "DROP TABLE {$wpdb->prefix}inovio_refunded;";
	$wpdb->query( $sql );
	delete_option( 'my_plugin_db_version' );
}
register_deactivation_hook(__FILE__, 'drop_inovio_plugin_database_table');