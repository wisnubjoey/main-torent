import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import {
    Badge,
} from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Award,
    BarChart3,
    Calendar,
    Car,
    ChevronLeft,
    ChevronRight,
    Clock,
    Flame,
    Fuel,
    Gauge,
    MapPin,
    MessageCircle,
    ShieldCheck,
    Snowflake,
    Star,
    Timer,
    Users,
} from 'lucide-react';
import { useRef, type SVGProps } from 'react';

type Vehicle = {
    name: string;
    image: string;
    seats: string;
    transmission: string;
    luggage: string;
    fuel?: string;
    price: string;
    cta?: string;
};

type PremiumVehicle = {
    name: string;
    image: string;
    highlight: string;
    description: string;
};

type SportCar = {
    name: string;
    image: string;
    horsepower: string;
    zeroToHundred: string;
    transmission: string;
};

const familyHighlights: Vehicle[] = [
    {
        name: 'Toyota Alphard Premium',
        image:
            'https://images.unsplash.com/photo-1619767886558-efdc259cde1f?auto=format&fit=crop&w=900&q=80',
        seats: '7 seats',
        transmission: 'Automatic',
        luggage: '4 luggage',
        fuel: 'Hybrid',
        price: '$189/day',
    },
    {
        name: 'Kia Carnival SX Prestige',
        image:
            'https://images.unsplash.com/photo-1620891549027-99f2c1682953?auto=format&fit=crop&w=900&q=80',
        seats: '8 seats',
        transmission: 'Automatic',
        luggage: '5 luggage',
        fuel: 'Diesel',
        price: '$179/day',
    },
];

const teaserVehicles: Vehicle[] = [
    {
        name: 'Mercedes-Benz V-Class',
        image:
            'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=900&q=80',
        seats: '7 seats',
        transmission: 'Automatic',
        luggage: '4 luggage',
        fuel: 'Diesel',
        price: '$229/day',
    },
    {
        name: 'Volkswagen Multivan',
        image:
            'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?auto=format&fit=crop&w=900&q=80',
        seats: '6 seats',
        transmission: 'Automatic',
        luggage: '4 luggage',
        fuel: 'Diesel',
        price: '$199/day',
    },
    {
        name: 'Range Rover Sport',
        image:
            'https://images.unsplash.com/photo-1523983300740-0d7f1f7dacdf?auto=format&fit=crop&w=900&q=80',
        seats: '5 seats',
        transmission: 'Automatic',
        luggage: '3 luggage',
        fuel: 'Petrol',
        price: '$249/day',
    },
    {
        name: 'BMW X7 Executive',
        image:
            'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=900&q=80',
        seats: '7 seats',
        transmission: 'Automatic',
        luggage: '4 luggage',
        fuel: 'Hybrid',
        price: '$259/day',
    },
];

const premiumVehicles: PremiumVehicle[] = [
    {
        name: 'Bentley Bentayga Azure',
        image:
            'https://images.unsplash.com/photo-1503377983885-d9cddf0de205?auto=format&fit=crop&w=900&q=80',
        highlight: 'Private chauffeur service available',
        description:
            'Five-star comfort with handcrafted interiors and the latest in-cabin tech for long routes.',
    },
    {
        name: 'Mercedes-Maybach GLS 600',
        image:
            'https://images.unsplash.com/photo-1605559424843-9e4c228bf1af?auto=format&fit=crop&w=900&q=80',
        highlight: 'Complimentary airport meet & greet',
        description:
            'Executive seating, AIRMATIC suspension, and panoramic sky lounge lighting for elevated journeys.',
    },
    {
        name: 'Porsche Cayenne Turbo GT',
        image:
            'https://images.unsplash.com/photo-1622643410811-6704461a3afe?auto=format&fit=crop&w=900&q=80',
        highlight: 'Track-mode briefing & concierge planning',
        description:
            'Supercar dynamics in an SUV body, perfect for scenic coastal drives or prestige events.',
    },
];

const sportCars: SportCar[] = [
    {
        name: 'Ferrari F8 Tributo',
        image:
            'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=900&q=80',
        horsepower: '710 hp',
        zeroToHundred: '2.9 s (0-100 km/h)',
        transmission: '7-speed dual-clutch',
    },
    {
        name: 'Lamborghini Huracán EVO',
        image:
            'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
        horsepower: '631 hp',
        zeroToHundred: '2.8 s (0-100 km/h)',
        transmission: '7-speed dual-clutch',
    },
    {
        name: 'Porsche 911 Turbo S',
        image:
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
        horsepower: '640 hp',
        zeroToHundred: '2.7 s (0-100 km/h)',
        transmission: '8-speed PDK',
    },
];

const features = [
    {
        title: 'Full Insurance',
        description: 'Comprehensive coverage with zero hidden excess.',
        icon: ShieldCheck,
    },
    {
        title: 'Always Clean Vehicles',
        description: 'Detailing crew sanitizes and refreshes every return.',
        icon: Snowflake,
    },
    {
        title: 'Airport/Hotel Delivery',
        description: 'Door-to-door concierge delivery in 50+ cities.',
        icon: MapPin,
    },
    {
        title: '24/7 Assistance',
        description: 'Live team and roadside partners around the clock.',
        icon: Clock,
    },
    {
        title: 'Flexible Cancellation',
        description: 'Reschedule or cancel up to 12 hours before pickup.',
        icon: Calendar,
    },
    {
        title: 'Secure Payment',
        description: 'Card vaults, Apple Pay, and fully trusted providers.',
        icon: ShieldCheck,
    },
];

const achievements = [
    { value: '300+', label: 'Luxury & MPV vehicles' },
    { value: '50+', label: 'Cities served globally' },
    { value: '99%', label: 'On-time airport pickups' },
];

const quickFilters = [
    { label: 'Seats 6+', icon: Users },
    { label: '3+ Luggage', icon: LuggageIcon },
    { label: 'Fuel Efficient', icon: Fuel },
];

function LuggageIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
            {...props}
        >
            <path d="M8 21h8" />
            <path d="M8 7V2h8v5" />
            <rect width="14" height="10" x="5" y="7" rx="2" />
            <path d="M10 11h4" />
        </svg>
    );
}

export default function Landing() {
    const { auth } = usePage<SharedData>().props;
    const carouselRef = useRef<HTMLDivElement>(null);

    const scrollCarousel = (direction: 'left' | 'right') => {
        const node = carouselRef.current;
        if (!node) return;
        const scrollAmount = direction === 'left' ? -360 : 360;
        node.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    return (
        <>
            <Head title="Luxury Vehicle Rentals">
                <meta
                    name="description"
                    content="Rent premium SUVs, MPVs, and supercars with full insurance, concierge delivery, and 24/7 support."
                />
            </Head>
            <div className="bg-background text-foreground">
                <header className="border-b bg-background/70 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                            <Car className="size-5 text-primary" />
                            Voyage Rentals
                        </Link>
                        <nav className="flex items-center gap-4 text-sm">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="text-muted-foreground transition hover:text-primary"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="text-muted-foreground transition hover:text-primary"
                                >
                                    Login
                                </Link>
                            )}
                            <Button className="hidden sm:inline-flex" size="sm">
                                Book Concierge
                            </Button>
                        </nav>
                    </div>
                </header>

                <main className="mx-auto flex max-w-7xl flex-col gap-20 px-6 pb-24 pt-12">
                    <section className="grid gap-12 lg:grid-cols-[1fr_450px] lg:items-center">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Badge className="bg-primary/10 text-primary shadow-none">
                                    Experience-first rentals for every journey
                                </Badge>
                                <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                    Family-ready MPVs and elite SUVs for your next escape.
                                </h1>
                                <p className="text-muted-foreground text-lg">
                                    Unlock concierge-level service, seamless bookings, and curated vehicles trusted for 20,000+ unforgettable trips worldwide.
                                </p>
                            </div>

                            <form className="rounded-2xl border bg-card/60 p-6 shadow-lg shadow-primary/5 backdrop-blur">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="pickup-location">Pickup Location</Label>
                                        <Input
                                            id="pickup-location"
                                            name="pickup-location"
                                            placeholder="Changi Airport Terminal 3"
                                            aria-label="Pickup location"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pickup-date">Pickup Date</Label>
                                        <Input
                                            id="pickup-date"
                                            name="pickup-date"
                                            type="date"
                                            aria-label="Pickup date"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pickup-time">Pickup Time</Label>
                                        <Input
                                            id="pickup-time"
                                            name="pickup-time"
                                            type="time"
                                            aria-label="Pickup time"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="vehicle-type">Vehicle Type</Label>
                                        <Select defaultValue="suv">
                                            <SelectTrigger id="vehicle-type" aria-label="Vehicle type">
                                                <SelectValue placeholder="Select vehicle" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="suv">SUV</SelectItem>
                                                <SelectItem value="mpv">MPV</SelectItem>
                                                <SelectItem value="luxury">Luxury</SelectItem>
                                                <SelectItem value="sport">Sport</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                        <Badge variant="secondary" className="gap-1 px-3 py-1 text-sm">
                                            <Star className="size-3.5 text-amber-400" />
                                            4.9/5 rating
                                        </Badge>
                                        <Badge variant="outline" className="gap-1 px-3 py-1 text-sm">
                                            <Users className="size-3.5" /> 20k+ trips
                                        </Badge>
                                        <Badge variant="outline" className="gap-1 px-3 py-1 text-sm">
                                            <ShieldCheck className="size-3.5" /> Full Insurance Included
                                        </Badge>
                                    </div>
                                    <Button type="submit" size="lg">
                                        Search Availability
                                    </Button>
                                </div>
                            </form>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1100&q=80"
                                alt="Family on vacation with luxury SUV"
                                className="h-full w-full rounded-3xl object-cover shadow-2xl shadow-primary/20"
                            />
                            <div className="absolute inset-0 rounded-3xl border border-white/40" />
                        </div>
                    </section>

                    <section className="grid gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-center">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                                Tailored for families, curated for unforgettable vacations.
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Spacious seating, comfort-focused amenities, and safety-first SUVs/MPVs make every journey feel effortless for multi-generation trips.
                            </p>
                            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="size-5 text-primary" />
                                    ISOFIX child-seat ready and full insurance on every ride.
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="size-5 text-primary" />
                                    Concierge trip planning for city, coastal, and outback escapes.
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="size-5 text-primary" />
                                    Airport pickup within 15 minutes of landing guaranteed.
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button size="lg">Plan a Family Getaway</Button>
                                <Button variant="outline" size="lg">
                                    Explore Family Fleet
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            {familyHighlights.map((vehicle) => (
                                <Card key={vehicle.name} className="overflow-hidden">
                                    <CardContent className="flex flex-col gap-4 px-0">
                                        <img
                                            src={vehicle.image}
                                            alt={vehicle.name}
                                            className="h-44 w-full object-cover"
                                        />
                                        <div className="space-y-3 px-6">
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground">
                                                    {vehicle.name}
                                                </h3>
                                                <p className="text-muted-foreground text-sm">
                                                    {vehicle.transmission} • {vehicle.fuel}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                <Badge variant="outline" className="px-2 py-1">
                                                    <Users className="mr-1 size-3" /> {vehicle.seats}
                                                </Badge>
                                                <Badge variant="outline" className="px-2 py-1">
                                                    <LuggageIcon className="mr-1 size-3" /> {vehicle.luggage}
                                                </Badge>
                                                <Badge variant="outline" className="px-2 py-1">
                                                    <Fuel className="mr-1 size-3" /> {vehicle.fuel}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex items-center justify-between border-t bg-muted/40 py-4">
                                        <span className="text-sm font-medium text-foreground">
                                            {vehicle.price}
                                        </span>
                                        <Button size="sm" variant="outline">
                                            View Details
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                                    MPV & SUV favorites ready to book today.
                                </h2>
                                <p className="text-muted-foreground">
                                    Filter by what matters most for your family adventure.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {quickFilters.map((filter) => (
                                    <Button
                                        key={filter.label}
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <filter.icon className="size-4" />
                                        {filter.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {teaserVehicles.map((vehicle) => (
                                <Card key={vehicle.name} className="overflow-hidden">
                                    <img
                                        src={vehicle.image}
                                        alt={vehicle.name}
                                        className="h-44 w-full object-cover"
                                    />
                                    <CardHeader className="gap-2">
                                        <CardTitle className="text-xl font-semibold">
                                            {vehicle.name}
                                        </CardTitle>
                                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                            <Badge variant="outline" className="px-2 py-1">
                                                <Users className="mr-1 size-3" /> {vehicle.seats}
                                            </Badge>
                                            <Badge variant="outline" className="px-2 py-1">
                                                <Gauge className="mr-1 size-3" /> {vehicle.transmission}
                                            </Badge>
                                            <Badge variant="outline" className="px-2 py-1">
                                                <LuggageIcon className="mr-1 size-3" /> {vehicle.luggage}
                                            </Badge>
                                            {vehicle.fuel && (
                                                <Badge variant="outline" className="px-2 py-1">
                                                    <Fuel className="mr-1 size-3" /> {vehicle.fuel}
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex items-center justify-between">
                                        <span className="text-base font-semibold text-foreground">
                                            {vehicle.price}
                                        </span>
                                        <Button size="sm" variant="outline">
                                            View Details
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <Button size="lg" className="px-10" asChild>
                                <Link href="/vehicles">View All Vehicles</Link>
                            </Button>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                                    Chauffeur-ready premium fleet
                                </h2>
                                <p className="text-muted-foreground">
                                    Slide through curated luxury picks and secure the perfect ride.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => scrollCarousel('left')}
                                    aria-label="Scroll premium vehicles left"
                                >
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => scrollCarousel('right')}
                                    aria-label="Scroll premium vehicles right"
                                >
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                        <div
                            ref={carouselRef}
                            className="relative flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
                        >
                            {premiumVehicles.map((vehicle) => (
                                <div
                                    key={vehicle.name}
                                    className="min-w-[280px] snap-start overflow-hidden rounded-2xl border bg-card shadow-sm sm:min-w-[360px]"
                                >
                                    <img
                                        src={vehicle.image}
                                        alt={vehicle.name}
                                        className="h-52 w-full object-cover"
                                    />
                                    <div className="space-y-3 p-6">
                                        <h3 className="text-xl font-semibold text-foreground">
                                            {vehicle.name}
                                        </h3>
                                        <p className="flex items-center gap-2 text-sm font-medium text-primary">
                                            <Award className="size-4" /> {vehicle.highlight}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {vehicle.description}
                                        </p>
                                        <div className="flex gap-3">
                                            <Button size="sm">Book Premium</Button>
                                            <Button variant="outline" size="sm">
                                                Compare Options
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-8">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                                    Weekend warriors, meet your dream supercars.
                                </h2>
                                <p className="text-muted-foreground">
                                    Performance-focused coupes with track briefings and concierge support.
                                </p>
                            </div>
                            <Button size="lg" variant="outline">
                                Check Weekend Availability
                            </Button>
                        </div>
                        <div className="grid gap-6 md:grid-cols-3">
                            {sportCars.map((vehicle) => (
                                <Card key={vehicle.name} className="overflow-hidden border-primary/20">
                                    <img
                                        src={vehicle.image}
                                        alt={vehicle.name}
                                        className="h-48 w-full object-cover"
                                    />
                                    <CardHeader className="gap-3">
                                        <CardTitle className="flex items-center justify-between text-xl">
                                            {vehicle.name}
                                            <Flame className="size-5 text-primary" />
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <BarChart3 className="size-4 text-primary" /> {vehicle.horsepower}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <Timer className="size-4 text-primary" /> {vehicle.zeroToHundred}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <Gauge className="size-4 text-primary" /> {vehicle.transmission}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="justify-end border-t bg-muted/40 py-4">
                                        <Button size="sm">Reserve this Weekend</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-3xl border bg-muted/40 p-10">
                        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="space-y-8">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {features.map(({ title, description, icon: Icon }) => (
                                        <div key={title} className="flex gap-4 rounded-2xl bg-background/80 p-4 shadow-sm">
                                            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Icon className="size-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-semibold text-foreground">
                                                    {title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    {achievements.map((stat) => (
                                        <div
                                            key={stat.label}
                                            className="rounded-2xl border border-primary/20 bg-background/70 p-6 text-center shadow-sm"
                                        >
                                            <div className="text-3xl font-semibold text-primary">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-3xl font-semibold text-foreground">
                                    Concierge-grade service in every city.
                                </h2>
                                <p className="text-muted-foreground">
                                    Our team monitors every trip with real-time telemetry, ensuring vehicles are spotless, punctual, and prepared for any itinerary.
                                </p>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Button size="lg" variant="outline" asChild>
                                        <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer">
                                            <MessageCircle className="mr-2 size-4" /> WhatsApp Concierge
                                        </a>
                                    </Button>
                                    <Button size="lg" asChild>
                                        <a href="tel:+18001234567">
                                            <PhoneIcon className="mr-2 size-4" /> Urgent Call
                                        </a>
                                    </Button>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-2xl border bg-background/80 p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-foreground">
                                            Business Hours
                                        </h3>
                                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                            <li>Monday – Friday: 7:00 – 22:00</li>
                                            <li>Saturday: 8:00 – 20:00</li>
                                            <li>Sunday: 8:00 – 18:00</li>
                                            <li>24/7 emergency hotline</li>
                                        </ul>
                                    </div>
                                    <div className="relative overflow-hidden rounded-2xl border shadow-sm">
                                        <iframe
                                            title="Voyage Rentals HQ"
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1994.15969140585!2d103.98935847794611!3d1.3592113612435304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da180cbab0eab3%3A0x7d15c93dffa50e0d!2sCar%20Rental%20Changi%20Airport!5e0!3m2!1sen!2ssg!4v1700000000000!5m2!1sen!2ssg"
                                            className="h-72 w-full"
                                            loading="lazy"
                                            allowFullScreen
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t bg-muted/40">
                    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-3">
                            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                                <Car className="size-5 text-primary" /> Voyage Rentals
                            </Link>
                            <p className="text-sm text-muted-foreground">
                                Premium vehicle rentals with concierge-grade service and trusted partners worldwide.
                            </p>
                            <div className="flex gap-3">
                                <Badge variant="outline" className="px-3 py-1 text-xs">
                                    <ShieldCheck className="mr-1 size-3" /> Secured by Stripe & PayPal
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <h3 className="text-base font-semibold text-foreground">Company</h3>
                            <Link href="/about">About</Link>
                            <Link href="/terms">Terms</Link>
                            <Link href="/privacy">Privacy</Link>
                            <Link href="/help-center">Help Center</Link>
                        </div>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <h3 className="text-base font-semibold text-foreground">Stay Connected</h3>
                            <Link href="https://instagram.com" target="_blank" rel="noreferrer">
                                Instagram
                            </Link>
                            <Link href="https://facebook.com" target="_blank" rel="noreferrer">
                                Facebook
                            </Link>
                            <Link href="https://tiktok.com" target="_blank" rel="noreferrer">
                                TikTok
                            </Link>
                            <Link href="https://youtube.com" target="_blank" rel="noreferrer">
                                YouTube
                            </Link>
                        </div>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <h3 className="text-base font-semibold text-foreground">Legal & Registered</h3>
                            <p>Voyage Mobility Group Pte. Ltd.</p>
                            <p>UEN: 202412345Z</p>
                            <p>Registered office: 88 Marina View, Singapore 018967</p>
                            <p className="text-xs">© {new Date().getFullYear()} Voyage Rentals. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function PhoneIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('size-4', props.className)}
            {...props}
        >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.09-8.67A2 2 0 0 1 4.14 2h3a2 2 0 0 1 2 1.72 12.6 12.6 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.28a2 2 0 0 1 2.11-.45 12.6 12.6 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
        </svg>
    );
}
