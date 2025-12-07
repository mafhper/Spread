/**
 * Gerenciador de Armazenamento Local
 * Gerencia persistência de preferências do usuário e cache de dados
 */

(function() {
    "use strict";

    const STORAGE_KEYS = {
        PREFERENCES: 'spread_preferences',
        RECENT_CARDS: 'spread_recent_cards',
        IMAGE_CACHE: 'spread_image_cache'
    };

    const MAX_RECENT_CARDS = 10;
    const MAX_CACHE_SIZE = 50; // Máximo de imagens em cache

    /**
     * Salva preferências do usuário
     */
    function savePreferences(preferences) {
        try {
            const data = {
                ...preferences,
                lastUpdated: Date.now()
            };
            localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(data));
            return true;
        } catch (error) {
            console.warn('⚠️ Erro ao salvar preferências:', error);
            return false;
        }
    }

    /**
     * Carrega preferências do usuário
     */
    function loadPreferences() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
            if (data) {
                const parsed = JSON.parse(data);
                // Remove timestamp antes de retornar
                delete parsed.lastUpdated;
                return parsed;
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar preferências:', error);
        }
        return null;
    }

    /**
     * Salva um card recente
     */
    function saveRecentCard(cardData) {
        try {
            let recent = loadRecentCards();
            if (!recent) recent = [];

            // Remove duplicatas
            recent = recent.filter(card => card.url !== cardData.url);

            // Adiciona no início
            recent.unshift({
                ...cardData,
                timestamp: Date.now()
            });

            // Limita o tamanho
            if (recent.length > MAX_RECENT_CARDS) {
                recent = recent.slice(0, MAX_RECENT_CARDS);
            }

            localStorage.setItem(STORAGE_KEYS.RECENT_CARDS, JSON.stringify(recent));
            return true;
        } catch (error) {
            console.warn('⚠️ Erro ao salvar card recente:', error);
            return false;
        }
    }

    /**
     * Carrega cards recentes
     */
    function loadRecentCards() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.RECENT_CARDS);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar cards recentes:', error);
        }
        return [];
    }

    /**
     * Limpa cards recentes
     */
    function clearRecentCards() {
        try {
            localStorage.removeItem(STORAGE_KEYS.RECENT_CARDS);
            return true;
        } catch (error) {
            console.warn('⚠️ Erro ao limpar cards recentes:', error);
            return false;
        }
    }

    /**
     * Salva imagem em cache (Base64)
     */
    function cacheImage(url, base64Data) {
        try {
            let cache = loadImageCache();
            if (!cache) cache = {};

            // Remove entrada mais antiga se cache estiver cheio
            const keys = Object.keys(cache);
            if (keys.length >= MAX_CACHE_SIZE) {
                // Remove a mais antiga (primeira entrada)
                delete cache[keys[0]];
            }

            cache[url] = {
                data: base64Data,
                timestamp: Date.now()
            };

            localStorage.setItem(STORAGE_KEYS.IMAGE_CACHE, JSON.stringify(cache));
            return true;
        } catch (error) {
            // Se exceder quota, limpa cache antigo
            if (error.name === 'QuotaExceededError') {
                clearOldImageCache();
                return cacheImage(url, base64Data); // Tenta novamente
            }
            console.warn('⚠️ Erro ao cachear imagem:', error);
            return false;
        }
    }

    /**
     * Carrega imagem do cache
     */
    function loadCachedImage(url) {
        try {
            const cache = loadImageCache();
            if (cache && cache[url]) {
                // Verifica se não está muito antiga (7 dias)
                const age = Date.now() - cache[url].timestamp;
                const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 dias
                
                if (age < maxAge) {
                    return cache[url].data;
                } else {
                    // Remove entrada expirada
                    delete cache[url];
                    saveImageCache(cache);
                }
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar imagem do cache:', error);
        }
        return null;
    }

    /**
     * Carrega cache de imagens
     */
    function loadImageCache() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.IMAGE_CACHE);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar cache de imagens:', error);
        }
        return {};
    }

    /**
     * Salva cache de imagens
     */
    function saveImageCache(cache) {
        try {
            localStorage.setItem(STORAGE_KEYS.IMAGE_CACHE, JSON.stringify(cache));
            return true;
        } catch (error) {
            console.warn('⚠️ Erro ao salvar cache de imagens:', error);
            return false;
        }
    }

    /**
     * Limpa cache antigo (mantém apenas últimas 24h)
     */
    function clearOldImageCache() {
        try {
            const cache = loadImageCache();
            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
            
            for (const url in cache) {
                if (cache[url].timestamp < oneDayAgo) {
                    delete cache[url];
                }
            }
            
            saveImageCache(cache);
            return true;
        } catch (error) {
            console.warn('⚠️ Erro ao limpar cache antigo:', error);
            return false;
        }
    }

    /**
     * Limpa todo o cache
     */
    function clearAllCache() {
        try {
            localStorage.removeItem(STORAGE_KEYS.IMAGE_CACHE);
            return true;
        } catch (error) {
            console.warn('⚠️ Erro ao limpar cache:', error);
            return false;
        }
    }

    // Exporta para window
    window.StorageManager = {
        savePreferences,
        loadPreferences,
        saveRecentCard,
        loadRecentCards,
        clearRecentCards,
        cacheImage,
        loadCachedImage,
        clearOldImageCache,
        clearAllCache
    };

})();

