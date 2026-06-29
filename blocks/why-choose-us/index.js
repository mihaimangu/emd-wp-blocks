(function () {
    var blocks        = wp.blocks;
    var el            = wp.element.createElement;
    var Fragment      = wp.element.Fragment;
    var blockEditor   = wp.blockEditor;
    var components    = wp.components;

    var InspectorControls = blockEditor.InspectorControls;
    var MediaUpload       = blockEditor.MediaUpload;
    var MediaUploadCheck  = blockEditor.MediaUploadCheck;

    var PanelBody       = components.PanelBody;
    var Button          = components.Button;
    var TextControl     = components.TextControl;
    var TextareaControl = components.TextareaControl;

    function updateFeature(list, index, fields) {
        return list.map(function (item, i) {
            if (i !== index) return item;
            return Object.assign({}, item, fields);
        });
    }

    blocks.registerBlockType('emd/why-choose-us', {
        title: 'EMD Why Choose Us',
        icon: 'awards',
        category: 'widgets',

        edit: function (props) {
            var attributes    = props.attributes;
            var setAttributes = props.setAttributes;
            var label         = attributes.sectionLabel;
            var title         = attributes.sectionTitle;
            var intro         = attributes.intro;
            var btnText       = attributes.btnText;
            var btnUrl        = attributes.btnUrl;
            var features      = attributes.features;

            function addFeature() {
                setAttributes({
                    features: features.concat([{
                        iconUrl: '',
                        iconId: 0,
                        title: 'Titlu feature',
                        text: 'Descriere feature...',
                    }])
                });
            }

            function removeFeature(index) {
                setAttributes({
                    features: features.filter(function (_, i) { return i !== index; })
                });
            }

            var inspector = el(
                InspectorControls,
                null,
                el(PanelBody, { title: 'Setări Secțiune', initialOpen: true },
                    el(TextControl, {
                        label: 'Label',
                        value: label,
                        onChange: function (val) { setAttributes({ sectionLabel: val }); }
                    }),
                    el(TextControl, {
                        label: 'Titlu',
                        value: title,
                        onChange: function (val) { setAttributes({ sectionTitle: val }); }
                    }),
                    el(TextareaControl, {
                        label: 'Intro',
                        value: intro,
                        rows: 3,
                        onChange: function (val) { setAttributes({ intro: val }); }
                    }),
                    el(TextControl, {
                        label: 'Text buton',
                        value: btnText,
                        onChange: function (val) { setAttributes({ btnText: val }); }
                    }),
                    el(TextControl, {
                        label: 'URL buton',
                        value: btnUrl,
                        onChange: function (val) { setAttributes({ btnUrl: val }); }
                    })
                ),
                features.map(function (f, index) {
                    return el(
                        PanelBody,
                        { title: 'Feature ' + (index + 1) + ' — ' + f.title, initialOpen: false, key: index },
                        el(MediaUploadCheck, null,
                            el(MediaUpload, {
                                onSelect: function (media) {
                                    setAttributes({
                                        features: updateFeature(features, index, { iconUrl: media.url, iconId: media.id })
                                    });
                                },
                                allowedTypes: ['image'],
                                value: f.iconId,
                                render: function (obj) {
                                    return el('div', { style: { marginBottom: '12px' } },
                                        f.iconUrl
                                            ? el('img', {
                                                src: f.iconUrl,
                                                style: { width: '44px', height: '44px', objectFit: 'contain', display: 'block', marginBottom: '8px' }
                                            })
                                            : null,
                                        el(Button, { onClick: obj.open, variant: 'secondary' },
                                            f.iconUrl ? 'Schimbă icon' : 'Selectează icon'
                                        )
                                    );
                                }
                            })
                        ),
                        el(TextControl, {
                            label: 'Titlu',
                            value: f.title,
                            onChange: function (val) {
                                setAttributes({ features: updateFeature(features, index, { title: val }) });
                            }
                        }),
                        el(TextareaControl, {
                            label: 'Text',
                            value: f.text,
                            rows: 3,
                            onChange: function (val) {
                                setAttributes({ features: updateFeature(features, index, { text: val }) });
                            }
                        }),
                        el(Button, {
                            onClick: function () { removeFeature(index); },
                            variant: 'link',
                            isDestructive: true,
                        }, 'Șterge feature')
                    );
                }),
                el(PanelBody, { title: 'Adaugă Feature', initialOpen: false },
                    el(Button, { onClick: addFeature, variant: 'primary' }, '+ Adaugă Feature')
                )
            );

            var preview = el('div', { className: 'am-left' },
                el('span', { className: 'am-label' }, label),
                el('h2', { className: 'am-title' }, title),
                el('p', { className: 'am-intro' }, intro),
                features.map(function (f, index) {
                    return el('div', { className: 'am-feature', key: index },
                        f.iconUrl
                            ? el('img', { src: f.iconUrl, alt: '' })
                            : el('div', { style: { width: '44px', height: '44px', background: '#eee', flexShrink: '0' } }),
                        el('div', null,
                            el('div', { className: 'am-feature-title' }, f.title),
                            el('p', { className: 'am-feature-text' }, f.text)
                        )
                    );
                }),
                el('a', { href: btnUrl, className: 'am-btn' }, btnText)
            );

            return el(Fragment, null, inspector, preview);
        },

        save: function () {
            return null;
        }
    });
})();
