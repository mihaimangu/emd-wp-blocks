(function () {
    var blocks      = wp.blocks;
    var el          = wp.element.createElement;
    var Fragment    = wp.element.Fragment;
    var blockEditor = wp.blockEditor;
    var components  = wp.components;
    var SSR         = wp.serverSideRender;

    var InspectorControls = blockEditor.InspectorControls;
    var PanelBody         = components.PanelBody;
    var TextControl       = components.TextControl;
    var RangeControl      = components.RangeControl;
    var CheckboxControl   = components.CheckboxControl;

    var categories = (window.emdGalleryData && window.emdGalleryData.categories) || [];

    blocks.registerBlockType('emd/gallery', {
        title: 'EMD Gallery',
        icon: 'format-gallery',
        category: 'widgets',

        edit: function (props) {
            var attributes    = props.attributes;
            var setAttributes = props.setAttributes;
            var categoryIds   = attributes.categoryIds || [];

            function toggleCategory(id, checked) {
                var numId = Number(id);
                var updated = checked
                    ? categoryIds.concat([numId])
                    : categoryIds.filter(function (x) { return x !== numId; });
                setAttributes({ categoryIds: updated });
            }

            var inspector = el(InspectorControls, null,
                el(PanelBody, { title: 'Setări Galerie', initialOpen: true },
                    el(TextControl, {
                        label: 'Label secțiune',
                        value: attributes.sectionLabel,
                        onChange: function (val) { setAttributes({ sectionLabel: val }); }
                    }),
                    el(TextControl, {
                        label: 'Titlu secțiune',
                        value: attributes.sectionTitle,
                        onChange: function (val) { setAttributes({ sectionTitle: val }); }
                    }),
                    el(RangeControl, {
                        label: 'Număr produse',
                        value: attributes.productCount,
                        min: 2,
                        max: 20,
                        onChange: function (val) { setAttributes({ productCount: val }); }
                    }),
                    el(RangeControl, {
                        label: 'Coloane',
                        value: attributes.columns,
                        min: 2,
                        max: 4,
                        onChange: function (val) { setAttributes({ columns: val }); }
                    })
                ),
                el(PanelBody, { title: 'Categorii produse', initialOpen: true },
                    categories.length === 0
                        ? el('p', { style: { fontSize: '12px', color: '#888' } }, 'Nu există categorii disponibile.')
                        : el('div', null,
                            el('p', { style: { fontSize: '12px', color: '#888', margin: '0 0 8px' } },
                                categoryIds.length === 0 ? 'Se afișează toate categoriile.' : ''
                            ),
                            categories.map(function (cat) {
                                return el(CheckboxControl, {
                                    key: cat.id,
                                    label: cat.name,
                                    checked: categoryIds.map(Number).indexOf(Number(cat.id)) !== -1,
                                    onChange: function (checked) { toggleCategory(cat.id, checked); }
                                });
                            }),
                            categoryIds.length > 0
                                ? el('button', {
                                    style: { marginTop: '8px', fontSize: '11px', cursor: 'pointer', background: 'none', border: 'none', color: '#888', padding: 0, textDecoration: 'underline' },
                                    onClick: function () { setAttributes({ categoryIds: [] }); }
                                }, 'Resetează (toate categoriile)')
                                : null
                        )
                )
            );

            var preview = el(SSR, {
                block: 'emd/gallery',
                attributes: attributes
            });

            return el(Fragment, null, inspector, preview);
        },

        save: function () {
            return null;
        }
    });
})();
