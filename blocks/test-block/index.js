(function () {
    wp.blocks.registerBlockType('emd/test-block', {
        title: 'EMD Test Block',
        icon: 'smiley',
        category: 'widgets',
        edit: function () {
            return wp.element.createElement('p', { style: { padding: '20px', background: '#f0f0f0', textAlign: 'center' } },
                '✅ EMD Blocks v1.2.0 — update funcționează!'
            );
        },
        save: function () { return null; }
    });
})();
