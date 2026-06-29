(function () {
    var blocks       = wp.blocks;
    var el           = wp.element.createElement;
    var Fragment     = wp.element.Fragment;
    var blockEditor  = wp.blockEditor;
    var components   = wp.components;

    var InspectorControls = blockEditor.InspectorControls;
    var MediaUpload       = blockEditor.MediaUpload;
    var MediaUploadCheck  = blockEditor.MediaUploadCheck;

    var PanelBody      = components.PanelBody;
    var Button         = components.Button;
    var TextControl    = components.TextControl;
    var TextareaControl = components.TextareaControl;
    var RangeControl   = components.RangeControl;

    function updateItem(list, index, fields) {
        return list.map(function (item, i) {
            if (i !== index) return item;
            return Object.assign({}, item, fields);
        });
    }

    blocks.registerBlockType('emd/testimonials', {
        title: 'EMD Testimonials',
        icon: 'format-quote',
        category: 'widgets',

        edit: function (props) {
            var attributes   = props.attributes;
            var setAttributes = props.setAttributes;
            var sectionLabel  = attributes.sectionLabel;
            var sectionTitle  = attributes.sectionTitle;
            var testimonials  = attributes.testimonials;

            function addTestimonial() {
                setAttributes({
                    testimonials: testimonials.concat([{
                        avatarUrl: '',
                        avatarId: 0,
                        name: 'Nume Client',
                        rating: 5,
                        text: 'Textul recenziei...',
                    }])
                });
            }

            function removeTestimonial(index) {
                setAttributes({
                    testimonials: testimonials.filter(function (_, i) { return i !== index; })
                });
            }

            var inspector = el(
                InspectorControls,
                null,
                el(PanelBody, { title: 'Setări Secțiune', initialOpen: true },
                    el(TextControl, {
                        label: 'Label secțiune',
                        value: sectionLabel,
                        onChange: function (val) { setAttributes({ sectionLabel: val }); }
                    }),
                    el(TextControl, {
                        label: 'Titlu secțiune',
                        value: sectionTitle,
                        onChange: function (val) { setAttributes({ sectionTitle: val }); }
                    })
                ),
                testimonials.map(function (t, index) {
                    return el(
                        PanelBody,
                        { title: 'Testimonial ' + (index + 1) + ' — ' + t.name, initialOpen: false, key: index },
                        el(MediaUploadCheck, null,
                            el(MediaUpload, {
                                onSelect: function (media) {
                                    setAttributes({
                                        testimonials: updateItem(testimonials, index, { avatarUrl: media.url, avatarId: media.id })
                                    });
                                },
                                allowedTypes: ['image'],
                                value: t.avatarId,
                                render: function (obj) {
                                    return el('div', { style: { marginBottom: '12px' } },
                                        t.avatarUrl
                                            ? el('img', {
                                                src: t.avatarUrl,
                                                style: { width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', display: 'block', marginBottom: '8px' }
                                            })
                                            : null,
                                        el(Button, { onClick: obj.open, variant: 'secondary' },
                                            t.avatarUrl ? 'Schimbă avatar' : 'Selectează avatar'
                                        )
                                    );
                                }
                            })
                        ),
                        el(TextControl, {
                            label: 'Nume',
                            value: t.name,
                            onChange: function (val) {
                                setAttributes({ testimonials: updateItem(testimonials, index, { name: val }) });
                            }
                        }),
                        el(RangeControl, {
                            label: 'Rating (stele)',
                            value: t.rating,
                            min: 1,
                            max: 5,
                            onChange: function (val) {
                                setAttributes({ testimonials: updateItem(testimonials, index, { rating: val }) });
                            }
                        }),
                        el(TextareaControl, {
                            label: 'Text recenzie',
                            value: t.text,
                            rows: 4,
                            onChange: function (val) {
                                setAttributes({ testimonials: updateItem(testimonials, index, { text: val }) });
                            }
                        }),
                        el(Button, {
                            onClick: function () { removeTestimonial(index); },
                            variant: 'link',
                            isDestructive: true,
                        }, 'Șterge testimonial')
                    );
                }),
                el(PanelBody, { title: 'Adaugă Testimonial', initialOpen: false },
                    el(Button, { onClick: addTestimonial, variant: 'primary' }, '+ Adaugă Testimonial')
                )
            );

            var preview = el('div', { className: 'emd-testimonials' },
                el('div', { className: 'emd-testimonials-header' },
                    el('p', { className: 'emd-testimonials-label' }, sectionLabel),
                    el('h2', { className: 'emd-testimonials-title' }, sectionTitle)
                ),
                el('div', { className: 'emd-testimonials-grid' },
                    testimonials.map(function (t, index) {
                        return el('div', { className: 'emd-testimonial-card', key: index },
                            el('div', { className: 'emd-testimonial-top' },
                                t.avatarUrl
                                    ? el('img', { className: 'emd-testimonial-avatar', src: t.avatarUrl, alt: t.name })
                                    : el('div', { className: 'emd-testimonial-avatar emd-avatar-placeholder' }),
                                el('div', { className: 'emd-testimonial-meta' },
                                    el('span', { className: 'emd-testimonial-name' }, t.name),
                                    el('div', { className: 'emd-testimonial-stars' },
                                        [1, 2, 3, 4, 5].map(function (i) {
                                            return el('span', {
                                                className: 'emd-star' + (i <= t.rating ? ' filled' : ''),
                                                key: i
                                            }, '★');
                                        })
                                    )
                                )
                            ),
                            el('div', { className: 'emd-testimonial-body' },
                                el('p', null, t.text)
                            )
                        );
                    })
                )
            );

            return el(Fragment, null, inspector, preview);
        },

        save: function () {
            return null;
        }
    });
})();
