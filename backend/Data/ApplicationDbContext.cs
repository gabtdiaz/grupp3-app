using Microsoft.EntityFrameworkCore;
using grupp3_app.Api.Models;

namespace grupp3_app.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }    

    // DbSets
    public DbSet<User> Users { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<EventParticipant> EventParticipants { get; set; }
    public DbSet<EventComment> EventComments { get; set; }
    public DbSet<Category> Categories { get; set; }  

    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // USER CONFIG

        modelBuilder.Entity<User>(entity =>
        {
            // Primary Key
            entity.HasKey(e => e.Id);

            // Index
            entity.HasIndex(e => e.Email).IsUnique(); 
            
            // Basic Identity
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).IsRequired();

            // Personal Info
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.DateOfBirth).IsRequired();
            entity.Property(e => e.Gender).IsRequired();
            entity.Property(e => e.City).IsRequired().HasMaxLength(100);

            // Profile (Optional)
            entity.Property(e => e.ProfileImageUrl).HasMaxLength(500);  // URL length  
            entity.Property(e => e.Bio).HasMaxLength(500);  
            entity.Property(e => e.Interests).IsRequired().HasMaxLength(1000);  // Komma-separerad lista

            // Settings (Optional)
            // entity.Property(e => e.MaxDistance)
            //     .IsRequired(false); // Ska vi ha en maxradie?

            // Timestamps
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired(false);  // Nullable DateTime
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Name).IsRequired().HasMaxLength(50);
            entity.Property(c => c.DisplayName).IsRequired().HasMaxLength(50);
            entity.Property(c => c.IconUrl).HasMaxLength(200);
            entity.Property(c => c.SortOrder).IsRequired();
            entity.Property(c => c.IsActive).IsRequired();
            
            // Seed initial categories
            entity.HasData(
                new Category { Id = 1, Name = "Rorelse", DisplayName = "RÖRELSE", IconUrl = "/icons/sport-icon.svg", SortOrder = 1, IsActive = true },
                new Category { Id = 2, Name = "Socialt", DisplayName = "SOCIALT", IconUrl = "/icons/social-icon.svg", SortOrder = 2, IsActive = true },
                new Category { Id = 3, Name = "Spel", DisplayName = "SPEL", IconUrl = "/icons/games-icon.svg", SortOrder = 3, IsActive = true },
                new Category { Id = 4, Name = "Kultur", DisplayName = "KULTUR", IconUrl = "/icons/culture-icon.svg", SortOrder = 4, IsActive = true },
                new Category { Id = 5, Name = "MatOchDryck", DisplayName = "MAT & DRYCK", IconUrl = "/icons/food-icon.svg", SortOrder = 5, IsActive = true },
                new Category { Id = 6, Name = "Utomhus", DisplayName = "UTOMHUS", IconUrl = "/icons/outdoor-icon.svg", SortOrder = 6, IsActive = true },
                new Category { Id = 7, Name = "Musik", DisplayName = "MUSIK", IconUrl = "/icons/music-icon.svg", SortOrder = 7, IsActive = true },
                new Category { Id = 8, Name = "Studier", DisplayName = "STUDIER", IconUrl = "/icons/study-icon.svg", SortOrder = 8, IsActive = true },
                new Category { Id = 9, Name = "Ovrigt", DisplayName = "ÖVRIGT", IconUrl = "/icons/other-icon.svg", SortOrder = 9, IsActive = true }
            );
        });

        // = EVENT CONFIG
        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.Location).IsRequired().HasMaxLength(200);
            entity.Property(e => e.StartDateTime).IsRequired();
            entity.Property(e => e.ImageUrl).HasMaxLength(500);
            entity.Property(e => e.IsActive).IsRequired();
            entity.Property(e => e.MaxParticipants).IsRequired();
            entity.Property(e => e.GenderRestriction).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();

            // ÄNDRAT: Category relationship
            entity.HasOne(e => e.Category)
                .WithMany(c => c.Events)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);  // Kan inte ta bort category om events använder den

            entity.HasOne(e => e.CreatedBy)
                .WithMany(u => u.CreatedEvents)
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        

        // EVENT PARTICIPANT CONFIG 
        
        modelBuilder.Entity<EventParticipant>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.JoinedAt).IsRequired();
            entity.Property(e => e.Status).IsRequired();

            // Relation till User
            entity.HasOne(e => e.User)
                .WithMany(u => u.EventParticipants)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Radera deltagande om User radeaas 
            
            // Relation till Event
            entity.HasOne(e => e.Event)
                .WithMany(ev => ev.Participants)
                .HasForeignKey(e => e.EventId)
                .OnDelete(DeleteBehavior.Cascade); // Radera deltagare om Event raderas
            
            //Unique: User kan endast joina event en gång
            entity.HasIndex(e => new { e.UserId, e.EventId }).IsUnique();
        });
        

        // EVENT COMMENT CONFIG 
        
        modelBuilder.Entity<EventComment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content).IsRequired().HasMaxLength(1000);
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired(false);
            
            // Relation till User
            entity.HasOne(e => e.User)
                .WithMany(u => u.EventComments)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Radera kommentar om User raderas
            
            // Relation till Event
            entity.HasOne(e => e.Event)
                .WithMany(ev => ev.Comments)
                .HasForeignKey(e => e.EventId)
                .OnDelete(DeleteBehavior.Cascade); // Radera kommentar om event raderas
        });
    }
}