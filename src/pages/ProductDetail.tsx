import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react';
import { PublicProduct } from '@/hooks/usePublicProducts';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, description, price, category, image_url, stock_quantity')
          .eq('id', id)
          .eq('is_active', true)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Errore caricamento prodotto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Caricamento prodotto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Prodotto non trovato</h1>
          <p className="text-muted-foreground mb-4">Il prodotto richiesto non esiste o non è disponibile.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Indietro
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-md flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="font-semibold">Ferramenta Lucini</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Package size={64} />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.category && (
                <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              )}
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              {product.description && (
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              )}
            </div>

            <div className="flex items-center justify-between py-4 border-y">
              <div>
                {product.price ? (
                  <p className="text-3xl font-bold text-primary">€{product.price.toFixed(2)}</p>
                ) : (
                  <p className="text-lg text-muted-foreground">Prezzo su richiesta</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Disponibilità</p>
                <p className={`font-semibold ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock_quantity > 0 ? `${product.stock_quantity} disponibili` : 'Esaurito'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                className="w-full" 
                size="lg"
                disabled={product.stock_quantity <= 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock_quantity > 0 ? 'Aggiungi al Carrello' : 'Non Disponibile'}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={() => window.location.href = '#contatti'}
              >
                Contattaci per Info
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}