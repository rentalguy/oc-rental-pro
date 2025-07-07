// Create the seedListings.ts file in the scripts directory
@"
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Generate mock listings
const generateMockListings = (propertyIds: string[], count: number) => {
  const listings = [];
  const statuses = ['active', 'inactive', 'pending'];
  const seasons = ['Summer', 'Fall', 'Winter', 'Spring'];

  for (let i = 0; i < count; i++) {
    const propertyId = faker.helpers.arrayElement(propertyIds);
    const startDate = faker.date.soon({ days: 30, refDate: new Date() });
    const endDate = faker.date.future({ years: 1, refDate: startDate });
    const season = seasons[Math.floor(Math.random() * seasons.length)];

    listings.push({
      property_id: propertyId,
      status: faker.helpers.arrayElement(statuses),
      price: faker.number.int({ min: 100, max: 1000 }),
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      min_nights: faker.helpers.arrayElement([2, 3, 4, 7, 14]),
      max_nights: faker.helpers.arrayElement([7, 14, 21, 28]),
      title: \`\${season} Getaway at \${faker.location.city()}\`,
      description: \`Beautiful \${season.toLowerCase()} vacation rental. \${faker.lorem.paragraph()}\`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  return listings;
};

// Main function to seed listings
const seedListings = async () => {
  try {
    console.log('Fetching properties...');
    
    // Fetch all property IDs
    const { data: properties, error } = await supabase
      .from('properties')
      .select('property_id');
    
    if (error) throw error;
    
    if (!properties || properties.length === 0) {
      console.error('No properties found. Please create properties first.');
      return;
    }

    const propertyIds = properties.map(p => p.property_id);
    console.log(\`Found \${propertyIds.length} properties. Generating listings...\`);

    // Generate 3-5 listings per property
    const listingsPerProperty = faker.number.int({ min: 3, max: 5 });
    const totalListings = propertyIds.length * listingsPerProperty;
    const mockListings = generateMockListings(propertyIds, totalListings);

    console.log(\`Inserting \${mockListings.length} listings...\`);
    
    // Insert in batches of 10
    const batchSize = 10;
    for (let i = 0; i < mockListings.length; i += batchSize) {
      const batch = mockListings.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from('listings')
        .insert(batch)
        .select();
      
      if (error) {
        console.error('Error inserting batch:', error);
      } else {
        console.log(\`Inserted batch \${Math.floor(i/batchSize) + 1} of \${Math.ceil(mockListings.length/batchSize)}\`);
      }
    }

    console.log('✅ Successfully seeded listings!');
  } catch (error) {
    console.error('Error seeding listings:', error);
  }
};

// Run the seeder
seedListings();
"@ | Out-File -FilePath "scripts/seedListings.ts" -Encoding utf8