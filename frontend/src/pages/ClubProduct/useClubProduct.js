import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';
import postService from '../../services/postService';
import { getImageUrl } from '../../utils/formatters';

export const useClubProduct = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const user = getCurrentUser();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImg, setActiveImg] = useState(null);
    const [activeColor, setActiveColor] = useState(null);
    const [activeSize, setActiveSize] = useState('');
    const [qty, setQty] = useState(1);
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const [activeTier, setActiveTier] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const data = await postService.getPost(type, id);
                setPost(data.post);
                if (data.post.images?.length > 0) setActiveImg(0);
                if (data.post.colors?.length > 0) setActiveColor(data.post.colors[0].id);
                if (data.post.sizes?.length > 0) setActiveSize(data.post.sizes[0]);
                if (data.post.tiers?.length > 0) setActiveTier(data.post.tiers[0].name);
            } catch (err) {
                console.error('Failed to fetch product:', err);
                setError('Product not found or has been removed.');
            } finally {
                setLoading(false);
            }
        };
        if (id && type) fetchProductDetails();
    }, [id, type]);

    const images = useMemo(() => {
        if (post?.images && post.images.length > 0) {
            return post.images.map((img, idx) => ({ id: idx, src: getImageUrl(img), alt: post.name }));
        }
        if (post?.coverImage) {
            return [{ id: 0, src: getImageUrl(post.coverImage), alt: post.name }];
        }
        return [];
    }, [post]);

    const currentImg = useMemo(() => images.find((i) => i.id === activeImg) || images[0], [activeImg, images]);

    const finalPrice = activeTier ? post?.tiers?.find(t => t.name === activeTier)?.price : post?.price;

    const handleBuy = () => {
        navigate('/marketplace/club/checkout', {
            state: {
                product: { ...post, price: finalPrice },
                selectedColor: post?.colors?.find(c => c.id === activeColor),
                selectedSize: activeSize || activeTier,
                quantity: qty,
            },
        });
    };

    return {
        navigate, user, post, loading, error,
        activeImg, setActiveImg, activeColor, setActiveColor,
        activeSize, setActiveSize, qty, setQty,
        isDescExpanded, setIsDescExpanded, activeTier, setActiveTier,
        images, currentImg, finalPrice, handleBuy,
    };
};
