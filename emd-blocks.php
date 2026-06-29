<?php
/**
 * Plugin Name: EMD Blocks
 * Description: Custom Gutenberg blocks pentru proiectele EMD.
 * Version: 1.0.0
 * Author: Mihai Mangu
 * Author URI: https://mihaimangu.ro
 * Text Domain: emd-blocks
 */

defined('ABSPATH') || exit;

add_action('init', function () {

    // --- Testimonials block ---

    wp_register_script(
        'emd-testimonials-editor',
        plugin_dir_url(__FILE__) . 'blocks/testimonials/index.js',
        ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components'],
        filemtime(plugin_dir_path(__FILE__) . 'blocks/testimonials/index.js'),
        true
    );

    wp_register_style(
        'emd-testimonials-style',
        plugin_dir_url(__FILE__) . 'blocks/testimonials/style.css',
        [],
        filemtime(plugin_dir_path(__FILE__) . 'blocks/testimonials/style.css')
    );

    register_block_type('emd/testimonials', [
        'editor_script'   => 'emd-testimonials-editor',
        'style'           => 'emd-testimonials-style',
        'attributes'      => [
            'sectionLabel' => [
                'type'    => 'string',
                'default' => 'Bucurie Handmade Împărtășită',
            ],
            'sectionTitle' => [
                'type'    => 'string',
                'default' => 'Ce Spun Clienții Noștri',
            ],
            'testimonials' => [
                'type'    => 'array',
                'default' => [
                    [
                        'avatarUrl' => '',
                        'avatarId'  => 0,
                        'name'      => 'Maria D.',
                        'rating'    => 5,
                        'text'      => 'Am fost impresionată de calitatea și atenția la detalii din fiecare set de cadouri. Se simte cu adevărat atingerea personală în fiecare produs!',
                    ],
                    [
                        'avatarUrl' => '',
                        'avatarId'  => 0,
                        'name'      => 'Andrei P.',
                        'rating'    => 5,
                        'text'      => 'Colecția de aromaterapie mi-a transformat casa într-un spațiu calm și relaxant. Mă simt atât de reîmprospătată de fiecare dată când o folosesc.',
                    ],
                    [
                        'avatarUrl' => '',
                        'avatarId'  => 0,
                        'name'      => 'Elena S.',
                        'rating'    => 5,
                        'text'      => 'Am cumpărat un buchet pentru ziua de naștere a unei prietene și a fost încântată. Fiecare aranjament floral este realizat cu grijă și arată superb.',
                    ],
                ],
                'items'   => ['type' => 'object'],
            ],
        ],
        'render_callback' => 'emd_render_testimonials',
    ]);

    // --- Gallery block ---

    wp_register_script(
        'emd-gallery-editor',
        plugin_dir_url(__FILE__) . 'blocks/gallery/index.js',
        ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-server-side-render'],
        filemtime(plugin_dir_path(__FILE__) . 'blocks/gallery/index.js'),
        true
    );

    $product_cats = get_terms([
        'taxonomy'   => 'product_cat',
        'hide_empty' => false,
        'orderby'    => 'name',
        'order'      => 'ASC',
    ]);
    $cats_data = [];
    if (!is_wp_error($product_cats)) {
        foreach ($product_cats as $cat) {
            $cats_data[] = [
                'id'   => $cat->term_id,
                'name' => $cat->name,
                'slug' => $cat->slug,
            ];
        }
    }
    wp_localize_script('emd-gallery-editor', 'emdGalleryData', [
        'categories' => $cats_data,
    ]);

    wp_register_script(
        'emd-gallery-frontend',
        plugin_dir_url(__FILE__) . 'blocks/gallery/frontend.js',
        [],
        filemtime(plugin_dir_path(__FILE__) . 'blocks/gallery/frontend.js'),
        true
    );

    wp_register_style(
        'emd-gallery-style',
        plugin_dir_url(__FILE__) . 'blocks/gallery/style.css',
        [],
        filemtime(plugin_dir_path(__FILE__) . 'blocks/gallery/style.css')
    );

    wp_register_style(
        'emd-gallery-editor-style',
        plugin_dir_url(__FILE__) . 'blocks/gallery/editor.css',
        ['emd-gallery-style'],
        filemtime(plugin_dir_path(__FILE__) . 'blocks/gallery/editor.css')
    );

    register_block_type('emd/gallery', [
        'editor_script'   => 'emd-gallery-editor',
        'editor_style'    => 'emd-gallery-editor-style',
        'style'           => 'emd-gallery-style',
        'attributes'      => [
            'sectionLabel' => [
                'type'    => 'string',
                'default' => 'Frumusețe Handmade Capturată',
            ],
            'sectionTitle' => [
                'type'    => 'string',
                'default' => 'Creațiile Noastre în Imagini',
            ],
            'productCount' => [
                'type'    => 'integer',
                'default' => 6,
            ],
            'columns'      => [
                'type'    => 'integer',
                'default' => 3,
            ],
            'categoryIds'  => [
                'type'    => 'array',
                'default' => [],
                'items'   => ['type' => 'integer'],
            ],
        ],
        'render_callback' => 'emd_render_gallery',
    ]);
});

// -------------------------------------------------------------------------
// Testimonials render
// -------------------------------------------------------------------------
function emd_render_testimonials($attributes) {
    $label        = esc_html($attributes['sectionLabel'] ?? '');
    $title        = esc_html($attributes['sectionTitle'] ?? '');
    $testimonials = $attributes['testimonials'] ?? [];

    ob_start();
    ?>
    <div class="emd-testimonials">
        <div class="emd-testimonials-header">
            <p class="emd-testimonials-label"><?php echo $label; ?></p>
            <h2 class="emd-testimonials-title"><?php echo $title; ?></h2>
        </div>
        <div class="emd-testimonials-grid">
            <?php foreach ($testimonials as $t) : ?>
            <div class="emd-testimonial-card">
                <div class="emd-testimonial-top">
                    <?php if (!empty($t['avatarUrl'])) : ?>
                        <img class="emd-testimonial-avatar" src="<?php echo esc_url($t['avatarUrl']); ?>" alt="<?php echo esc_attr($t['name']); ?>">
                    <?php else : ?>
                        <div class="emd-testimonial-avatar emd-avatar-placeholder"></div>
                    <?php endif; ?>
                    <div class="emd-testimonial-meta">
                        <span class="emd-testimonial-name"><?php echo esc_html($t['name']); ?></span>
                        <div class="emd-testimonial-stars">
                            <?php for ($i = 1; $i <= 5; $i++) : ?>
                                <span class="emd-star <?php echo $i <= intval($t['rating'] ?? 5) ? 'filled' : ''; ?>">★</span>
                            <?php endfor; ?>
                        </div>
                    </div>
                </div>
                <div class="emd-testimonial-body">
                    <p><?php echo esc_html($t['text']); ?></p>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

// -------------------------------------------------------------------------
// Gallery render
// -------------------------------------------------------------------------
function emd_render_gallery($attributes) {
    if (!function_exists('wc_get_products')) {
        return '<p style="padding:20px;color:#c00;">WooCommerce este necesar pentru blocul EMD Gallery.</p>';
    }

    $label   = esc_html($attributes['sectionLabel'] ?? '');
    $title   = esc_html($attributes['sectionTitle'] ?? '');
    $count   = intval($attributes['productCount'] ?? 6);
    $columns = intval($attributes['columns'] ?? 3);

    $category_ids = array_map('intval', $attributes['categoryIds'] ?? []);

    $wc_args = [
        'limit'   => $count,
        'status'  => 'publish',
        'orderby' => 'date',
        'order'   => 'DESC',
        'return'  => 'objects',
    ];

    if (!empty($category_ids)) {
        $slugs = [];
        foreach ($category_ids as $id) {
            $term = get_term($id, 'product_cat');
            if ($term && !is_wp_error($term)) {
                $slugs[] = $term->slug;
            }
        }
        if (!empty($slugs)) {
            $wc_args['category'] = $slugs;
        }
    }

    $products = wc_get_products($wc_args);

    if (empty($products)) {
        return '<p style="padding:20px;">Nu există produse de afișat.</p>';
    }

    wp_enqueue_script('emd-gallery-frontend');

    $col_css = 'repeat(' . $columns . ', 1fr)';

    ob_start();
    ?>
    <div class="emd-gallery">
        <div class="emd-gallery-header">
            <p class="emd-gallery-label"><?php echo $label; ?></p>
            <h2 class="emd-gallery-title"><?php echo $title; ?></h2>
        </div>
        <div class="emd-gallery-grid" style="grid-template-columns: <?php echo esc_attr($col_css); ?>">
            <?php foreach ($products as $product) :
                $image_id  = $product->get_image_id();
                if (!$image_id) continue;
                $image_url = wp_get_attachment_image_url($image_id, 'large');
                $alt       = get_the_title($product->get_id());
                $link      = get_permalink($product->get_id());
            ?>
            <div class="emd-gallery-item">
                <a href="<?php echo esc_url($link); ?>">
                    <img src="<?php echo esc_url($image_url); ?>"
                         alt="<?php echo esc_attr($alt); ?>"
                         loading="lazy">
                </a>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
